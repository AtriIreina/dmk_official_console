import { Button, Card, Modal, message, Radio } from 'antd';
import ProForm, {
  ProFormItem,
  ProFormText,
  ProFormTreeSelect,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import type { FC } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProFormInstance } from '@ant-design/pro-components';
import { fakeSubmitForm } from './service';
import { rule as getArticleType } from '../article-type/service';
import { addRule as publishArticle } from '../article/service';

import '@wangeditor/editor/dist/css/style.css'; // 引入 css

import React, { useState, useRef, useEffect } from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { SlateElement } from '@wangeditor/editor';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';
import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from '../../../utils/localStorageUtil';

const BasicForm: FC<Record<string, any>> = () => {
  interface ArticleType {
    id: number;
    name: string;
    columnId: number;
  }
  interface SelectType {
    title: string;
    value: any;
    children?: any;
  }
  let newData: SelectType[];

  type ImageElement = SlateElement & {
    src: string;
    alt: string;
    url: string;
    href: string;
  };

  // editor 实例
  const [editor, setEditor] = useState<IDomEditor | null>(null); // TS 语法
  // const [editor, setEditor] = useState(null)                   // JS 语法

  // 编辑器内容
  const [html, setHtml] = useState('');

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    setTimeout(() => {
      setHtml('');
    }, 1500);
  }, []);

  // 工具栏配置
  const toolbarConfig: Partial<IToolbarConfig> = {};
  toolbarConfig.excludeKeys = [
    'group-video', // 排除菜单组，写菜单组 key 的值即可
  ];

  // 编辑器配置
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {},
  };

  //==============================================================
  // 自定义校验链接===============================
  //==============================================================
  function customCheckLinkFn(text: string, url: string): string | boolean | undefined {
    if (!url) {
      return;
    }
    if (url.indexOf('http') !== 0) {
      return '链接必须以 http/https 开头';
    }
    return true;

    // 返回值有三种选择：
    // 1. 返回 true ，说明检查通过，编辑器将正常插入链接
    // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
    // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
  }

  // 自定义转换链接 url
  function customParseLinkUrl(url: string): string {
    if (url.indexOf('http') !== 0) {
      return `http://${url}`;
    }
    return url;
  }

  // 插入链接
  editorConfig.MENU_CONF['insertLink'] = {
    checkLink: customCheckLinkFn, // 也支持 async 函数
    parseLinkUrl: customParseLinkUrl, // 也支持 async 函数
  };
  // 更新链接
  editorConfig.MENU_CONF['editLink'] = {
    checkLink: customCheckLinkFn, // 也支持 async 函数
    parseLinkUrl: customParseLinkUrl, // 也支持 async 函数
  };

  //==============================================================
  // 自定义校验图片===============================
  //==============================================================
  function customCheckImageFn(src: string, alt: string, url: string): boolean | undefined | string {
    if (!src) {
      return;
    }
    if (src.indexOf('http') !== 0) {
      return '图片网址必须以 http/https 开头';
    }
    return true;

    // 返回值有三种选择：
    // 1. 返回 true ，说明检查通过，编辑器将正常插入图片
    // 2. 返回一个字符串，说明检查未通过，编辑器会阻止插入。会 alert 出错误信息（即返回的字符串）
    // 3. 返回 undefined（即没有任何返回），说明检查未通过，编辑器会阻止插入。但不会提示任何信息
  }

  // 转换图片链接
  function customParseImageSrc(src: string): string {
    if (src.indexOf('http') !== 0) {
      return `http://${src}`;
    }
    return src;
  }

  let imageList1: string[] = [];
  // let [imageList1, setImageList1] = useState([]);
  // let [imageList2, setImageList2] = useState([]);
  let imageList2: string[] = [];
  //imageList1收集所有上传或者插入的图片
  //imageList2获取当前编辑器的所有图片
  //对比 imageList1 和 imageList2 ，两者的差异，就是删除过的图片, 可以在服务器也把图片文件删了

  // 插入图片
  editorConfig.MENU_CONF['insertImage'] = {
    onInsertedImage(imageNode: ImageElement | null) {
      if (imageNode == null) return;

      const { src, alt, url, href } = imageNode;
      console.log('inserted image', src, alt, url, href);
      console.log('inserted image imageNode', imageNode);
      imageList1.push(src);
      console.log('imageList1-push:', imageList1);
    },
    checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
  };
  // 编辑图片
  editorConfig.MENU_CONF['editImage'] = {
    onUpdatedImage(imageNode: ImageElement | null) {
      // TS 语法
      if (imageNode == null) return;

      const { src, alt, url } = imageNode;
      console.log('updated image', src, alt, url);
    },
    checkImage: customCheckImageFn, // 也支持 async 函数
    parseImageSrc: customParseImageSrc, // 也支持 async 函数
  };

  //==============================================================
  // 上传图片===============================
  //==============================================================
  editorConfig.MENU_CONF['uploadImage'] = {
    // 服务端地址=========================================
    server: '/api/content/upload/image',

    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 5 * 1024, // 5kb

    // 基本配置============================================
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'filedata',

    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 3 * 1024 * 1024, // 3M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 5,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/*'],

    // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
    meta: {},

    // 将 meta 拼接到 url 参数中，默认 false
    metaWithUrl: false,

    // 自定义增加 http  header
    headers: {
      Authorization: 'bearer ' + getStorage('token'),
      // Accept: 'text/x-json',
      // otherKey: 'xxx',
    },

    // 跨域是否传递 cookie ，默认为 false
    withCredentials: true,

    // 超时时间，默认为 10 秒
    timeout: 5 * 1000, // 5 秒

    // 回调函数=============================================
    // 上传之前触发
    onBeforeUpload(file: File) {
      // TS 语法
      // onBeforeUpload(file) {    // JS 语法
      // file 选中的文件，格式如 { key: file }
      return file;

      // 可以 return
      // 1. return file 或者 new 一个 file ，接下来将上传
      // 2. return false ，不上传这个 file
    },

    // 上传进度的回调函数
    onProgress(progress: number) {
      // TS 语法
      // onProgress(progress) {       // JS 语法
      // progress 是 0-100 的数字
      console.log('progress', progress);
    },

    // 单个文件上传成功之后
    onSuccess(file: File, res: any) {
      // TS 语法
      // onSuccess(file, res) {          // JS 语法
      console.log(`${file.name} 上传成功`, res);
    },

    // 单个文件上传失败
    onFailed(file: File, res: any) {
      // TS 语法
      // onFailed(file, res) {           // JS 语法
      console.log(`${file.name} 上传失败`, res);
    },

    // 上传错误，或者触发 timeout 超时
    onError(file: File, err: any, res: any) {
      // TS 语法
      // onError(file, err, res) {               // JS 语法
      console.log(`${file.name} 上传出错`, err, res);
    },
  };

  // 及时销毁 editor ，重要！
  useEffect(() => {
    return () => {
      if (editor == null) return;
      editor.destroy();
      setEditor(null);
    };
  }, [editor]);

  // const { run } = useRequest(fakeSubmitForm, {
  //   manual: true,
  //   onSuccess: () => {
  //     message.success('提交成功');
  //   },
  // });

  const restFormRef = useRef<ProFormInstance>();
  //刷新表单
  const refreshForm = () => {
    restFormRef.current?.resetFields();
    setHtml('');
  };

  const setImgWidth2Html = () => {
    console.log('Editor-onChange..............:');
    //TODO: 上传新闻之前检查是否有图片, 并设置宽度style="width:100%"
    // 创建一个新的div元素
    const div = document.createElement('div');

    // 将HTML代码作为片段插入到div元素中
    div.innerHTML = html;

    // 获取所有的image标签
    const images = div.getElementsByTagName('img');

    // 遍历每个image标签
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      console.log('image:', image);

      // 检查是否已经设置了style属性
      if (!image.hasAttribute('style')) {
        // 添加style属性并设置宽度为100%
        image.setAttribute('style', 'width:100%');
        console.log('setAttribute-if:');
      } else {
        // 获取已有的style属性值
        const style = image.getAttribute('style');
        console.log('setAttribute-else:', style);

        // 检查style属性值是否包含width:100%
        if (style.indexOf('width:100%') === -1 || style.indexOf('width: 100%') === -1) {
          // 在已有的style属性值后面添加width:100%
          image.setAttribute('style', style + 'width:100%');
        }
      }
    }

    // 获取处理后的HTML代码字符串
    const processedHtmlCode = div.innerHTML;
    console.log('processedHtmlCode:', processedHtmlCode);

    setHtml(processedHtmlCode);
    return processedHtmlCode;
  };

  const onFinish = async (values: Record<string, any>) => {
    // run(values);
    if (html == null || html == '<p><br></p>' || html == '<p></p>') {
      message.error('请输入新闻内容');
    } else {
      values.content = html;
      console.log('values:', values);

      values.content = setImgWidth2Html();

      console.log('onFinish-values', values);

      if (img == null || img == undefined) {
        message.error('请选择新闻封面');
      } else {
        if (uploadMethod == 'upload') {
          values.coverUrl = img;
        }

        const result = await publishArticle(values);
        const insertedImgs: ImageElement[] = editor.getElemsByType('image');
        console.log('insertedImgs:', insertedImgs);
        insertedImgs.map((item) => {
          imageList2.push(item.src);
        });
        //TODO: DO 对比图片src,去除已插入但未被使用的图片
        console.log('imageList1:', imageList1);
        console.log('imageList2:', imageList2);
        console.log('result:', result);
        if (result.code == 0) {
          message.success('新闻发布成功');
          refreshForm();
        } else {
          message.error(result.msg);
        }
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const previewHandle = () => {
    setImgWidth2Html();

    showModal();
  };

  //选择文件上传方式
  const [uploadMethod, setUploadMethod] = useState('upload');
  const [img, setImg] = useState('');

  return (
    <PageContainer content="">
      <Card bordered={true}>
        <ProForm
          hideRequiredMark
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          name="basic"
          layout="vertical"
          initialValues={{ public: '1' }}
          onFinish={onFinish}
          formRef={restFormRef}
          submitter={{
            // 配置按钮文本
            searchConfig: {
              resetText: '重置',
              submitText: '提交',
            },
            // 配置按钮的属性
            resetButtonProps: {
              style: {
                // 隐藏重置按钮
                // display: 'none',
              },
            },
            submitButtonProps: {},

            // 完全自定义整个区域
            render: (props, doms) => {
              console.log(props);
              return [
                // <button type="button" key="rest" onClick={() => props.form?.resetFields()}>
                //   重置
                // </button>,
                // <button type="button" key="submit" onClick={() => props.form?.submit?.()}>
                //   提交
                // </button>,
                <Button key="preview" onClick={previewHandle} type="primary">
                  预览新闻
                </Button>,
                doms,
              ];
            },
          }}
        >
          <ProFormText
            width="lg"
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入新闻标题',
              },
            ]}
            placeholder="请输入新闻标题"
          />
          <ProFormItem name="coverUrl" label="封面图片">
            {/* TODO: WAIT DO 图片上传 */}
            <Radio.Group onChange={(e) => setUploadMethod(e.target.value)} value={uploadMethod}>
              <Radio value="upload">上传图片</Radio>
              {/* <Radio value="drag">拖拽上传</Radio> */}
              <Radio value="url">输入链接</Radio>
            </Radio.Group>
            {uploadMethod === 'upload' && (
              <ProFormUploadButton
                //这个是修改表单的字段
                name="img1"
                max={1}
                fieldProps={{
                  accept: '.png,.jpg,.jpeg',
                  multiple: true,
                  //这个是上传图片的 后台参数名
                  name: 'filedata',
                  headers: { Authorization: 'bearer ' + getStorage('token') },
                  onChange(info) {
                    const file = info.file;
                    const status = info.file.status;
                    if (status === 'done') {
                      // 完成
                      message.success('图片上传成功...');
                      const res = file.response.data; // 上传后台返回的结果
                      const url = info.file.response.data.url;
                      console.log(url);
                      console.log('restFormRef:', restFormRef.current);
                      setImg(url);

                      // props.values.icon = url;
                      console.log('url:', url);
                    } else if (status === 'error') {
                      // 错误
                      message.error(`${info.file.name} 文件上传失败`);
                    }
                  },
                }}
                action="/api/content/upload/image"
              />
            )}
            {uploadMethod === 'url' && (
              <ProFormText
                name="coverUrl"
                width="lg"
                fieldProps={{
                  placeholder: '请输入图片链接',
                }}
                rules={[
                  {
                    pattern: /^(https?:\/\/)?[\w\-./]*\.(png|jpg|jpeg)$/,
                    message: '请输入合法的图片链接',
                  },
                ]}
              />
            )}
          </ProFormItem>
          <ProFormTreeSelect
            width="md"
            label="新闻类型"
            name="articleTypeId"
            placeholder={'请选择新闻类型'}
            request={async () => {
              //TODO: DO 获取新闻类型
              let data: ArticleType[];
              const result = await getArticleType({}, {});
              if (result.successful) {
                data = result.result.items;
                newData = data.map((obj) => {
                  return {
                    title: obj.name,
                    value: obj.id,
                  };
                });
              }
              console.log('getArticleType:', newData);
              return newData;
            }}
            rules={[{ required: true, message: '请选择新闻类型' }]}
          />

          <ProFormItem
            label="新闻内容"
            name="content"
            // rules={[{ required: true, message: '请输入新闻内容' }]}
          >
            <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
              <Toolbar
                editor={editor}
                defaultConfig={toolbarConfig}
                mode="default"
                style={{ borderBottom: '1px solid #ccc' }}
              />
              <Editor
                defaultConfig={editorConfig}
                value={html}
                onCreated={setEditor}
                onChange={(editor) => {
                  setHtml(editor.getHtml());
                  // value = editor.getHtml();
                }}
                mode="default"
                style={{ height: '500px', overflowY: 'hidden' }}
              />
            </div>
          </ProFormItem>
        </ProForm>
        <Modal
          title="预览新闻"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={[]}
        >
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </Modal>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
