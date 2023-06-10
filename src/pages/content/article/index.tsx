import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Select, Modal, Radio } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
  ProFormSelect,
  ProFormUploadButton,
  ProFormUploadDragger,
  ProFormItem,
  ProFormDateTimePicker,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import type { ProFormInstance } from '@ant-design/pro-components';
import { initial } from 'lodash';

import { rule as getArticleType } from '../article-type/service';
import { TableListItem as articleType } from '../article-type/data';

// import BasicForm from './editor';
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { SlateElement } from '@wangeditor/editor';
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor';

import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from '../../../utils/localStorageUtil';

import handleRequest from '../../../utils/handleRequest';

/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  return handleRequest(addRule({ ...fields }), '添加成功');
};
/**
 * 更新节点
 *
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: TableListItem) => {
  return handleRequest(
    updateRule({
      ...currentRow,
      ...fields,
    }),
    '修改成功',
  );
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: TableListItem[]) => {
  return handleRequest(
    removeRule({
      key: selectedRows.map((row) => row.id),
    }),
    '删除成功',
  );
};

const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormCurrentStep, setStepFormCurrentStep] = useState(0);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */

  const [html, setHtml] = useState('');
  const [articlePreview, setArticlePreview] = useState(false);
  const [articleEdit, setArticleEdit] = useState(false);

  const [article, setArticle] = useState({});
  const articleRef = useRef({});

  useEffect(() => {
    articleRef.current = article;
    console.log('articleRef.current:', articleRef.current);
    console.log('articleRef.article:', article);
  }, [article]);

  const [articleId, setArticleId] = useState(0);
  // let aa = { title: '1', content: 'content' };

  //TODO: 5.连表查询字段
  let [articleTypeValueEnum, setArticleTypeValueEnum] = useState({});

  //TODO: 2.修改数据展示
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '新闻id',
      dataIndex: 'id',
      tip: '新闻的基本标识',
      hideInTable: true,
      sorter: (a, b) => {
        return a.id - b.id;
      },
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '文章类型',
      dataIndex: 'articleTypeId',
      valueEnum: articleTypeValueEnum,
    },
    {
      title: '新闻封面',
      dataIndex: 'coverUrl',
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '内容',
      dataIndex: 'content',
      hideInTable: true,
      hideInDescriptions: true,
    },
    {
      title: '发布时间',
      dataIndex: 'publicDate',
      valueType: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      onFilter: true,
      ellipsis: true,
      valueType: 'select',
      valueEnum: {
        '0': {
          text: '未启用',
          status: 'error',
        },
        '1': {
          text: '使用中',
          status: 'success',
        },
      },
    },
    {
      width: '250px',
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Button
          key="preview"
          onClick={() => {
            setHtml(record.content);
            setArticlePreview(true);
            console.log('record.content:', record.content);
            console.log('html:', html);
          }}
          type="primary"
        >
          查看内容
        </Button>,
        //TODO: 修改内容时有问题
        <Button
          key="edit"
          onClick={() => {
            setHtml(record.content);
            setArticle(record);
            setArticleId(record.id);
            console.log('record:', record);
            console.log('articleRef:', articleRef);
            setArticleEdit(true);
            // aa = record;
            // console.log('aa:', aa);
          }}
          type="primary"
        >
          修改内容
        </Button>,
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          改
        </a>,
        <a
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删
        </a>,
      ],
    },
  ];

  const handleSelect = (value: string) => {
    //TODO: WAIT 导出文件
    console.log(`selected ${value}`);
  };

  // const memberLevelOptions = [
  //   { label: '普通会员', value: 1 },
  //   { label: '银牌会员', value: 2 },
  //   { label: '金牌会员', value: 3 },
  //   { label: '钻石会员', value: 4 },
  // ];

  const statusOptions = [
    { label: '使用中', value: 1 },
    { label: '未启用', value: 0 },
  ];

  const restFormRef = useRef<ProFormInstance>();
  const formRef = useRef<ProFormInstance>();

  // 确认删除对话框
  const [isModalOpen, setIsModalOpen] = useState(false); //是否显示
  const [confirmLoading, setConfirmLoading] = useState(false); //是否等待

  //选择文件上传方式
  const [uploadMethod, setUploadMethod] = useState('upload');

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    setConfirmLoading(true);
    //确认删除
    await handleRemove(selectedRowsState);
    //设置等待1s
    setTimeout(() => {
      setIsModalOpen(false);
      setConfirmLoading(false);
    }, 2000);
    setSelectedRows([]);
    actionRef.current?.reloadAndRest?.();
  };
  const handleCancel = () => {
    //取消删除
    setIsModalOpen(false);
  };

  //图片拖拽上传
  const handleUpload = async (file: File) => {
    // 处理文件上传
    console.log('上传的文件：', file);
    message.success('上传成功！');
  };

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
  // const [html, setHtml] = useState('');
  // setHtml(props.article.content);

  //TODO: 修改新闻时初始化内容 (首次渲染后,只有第二个参数改变时才会重新渲染)
  // useEffect(() => {
  //   console.log('新闻管理article:', props.article);
  //   setHtml(props.article.content);
  //   console.log('html----:', html);
  //   console.log('props.articleId----:', props.articleId);
  // }, props.articleId);

  // 模拟 ajax 请求，异步设置 html
  // useEffect(() => {
  //   setTimeout(() => {
  //     setHtml('');
  //   }, 1500);
  // }, []);

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

  //  const restFormRef = useRef<ProFormInstance>();
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

      values.content = setImgWidth2Html();
      console.log('onFinish-values:', values);

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
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        scroll={{ x: 'max-content' }}
        rowKey="id"
        search={{
          labelWidth: 70,
        }}
        toolBarRender={() => [
          <Select
            key="out"
            defaultValue="导出数据"
            style={{ width: 150 }}
            onSelect={handleSelect}
            options={[
              { value: 'excel', label: '导出 Excel 表格' },
              { value: 'pdf', label: '导出 PDF 文档' },
            ]}
          />,
          <Button
            type="primary"
            key="add"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建数据
          </Button>,
        ]}
        //request={rule}
        request={async (
          // 第一个参数 params 查询表单和 params 参数的结合
          // 第一个参数中一定会有 pageSize 和  current ，这两个参数是 antd 的规范
          params: {
            pageSize: number;
            current: number;
          },
          sort,
          filter,
        ) => {
          const typeResult = await getArticleType({
            pageSize: 100,
            current: 0,
          });

          let totalObj = {};
          typeResult.result.items.forEach((type) => {
            let obj = {};
            obj[type.id] = type.name;
            totalObj = { ...totalObj, ...obj };
          });
          setArticleTypeValueEnum(totalObj);
          console.log('articleTypeValueEnum:', articleTypeValueEnum);

          // 这里需要返回一个 Promise,在返回之前你可以进行数据转化
          // 如果需要转化参数可以在这里进行修改
          const { current, pageSize, ...options } = params;
          const data = await rule(
            {
              pageSize: params.pageSize,
              current: params.current,
            },
            options,
          );
          return {
            data: data.result.items,
            // success 请返回 true，
            // 不然 table 会停止解析数据，即使有数据
            success: data.msg == 'success',
            // 不传会使用 data 的长度，如果是分页一定要传
            // total: number,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
            console.log('selectedRows', selectedRows.length);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
              {/* <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo!, 0)} 万
              </span> */}
            </div>
          }
        >
          <Button
            type="primary"
            danger
            onClick={async () => {
              // await handleRemove(selectedRowsState);
              // setSelectedRows([]);
              // actionRef.current?.reloadAndRest?.();
              showModal();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      <Modal
        title="系统提示"
        open={isModalOpen}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>确认删除数据? (可从回收站找回)</p>
      </Modal>
      <ModalForm
        title="新建数据"
        formRef={restFormRef}
        visible={createModalVisible}
        onVisibleChange={(visiable) => {
          handleModalVisible(visiable);
          restFormRef.current?.resetFields();
        }}
        //通过 formRef 重置
        submitter={{
          searchConfig: {
            resetText: '重置',
          },
          resetButtonProps: {
            onClick: () => {
              restFormRef.current?.resetFields();
            },
          },
        }}
        //提交表单且数据验证成功
        onFinish={async (value) => {
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        layout={'vertical'}
      >
        {/* TODO: 4.修改新增表单 */}

        <ProForm.Group title="基本信息">
          <ProFormText
            name="title"
            label="新闻标题"
            rules={[{ required: true, message: '新闻标题' }]}
          />
          <ProFormSelect
            name="articleTypeId"
            label="新闻类型"
            valueEnum={articleTypeValueEnum}
            rules={[{ required: true, message: '新闻类型' }]}
          />
          <ProFormDateTimePicker name="publicDate" label="发布日期" initialValue={new Date()} />
          <ProFormText name="coverUrl" label="新闻封面" />
          <ProFormSelect
            name="status"
            label="状态"
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
        </ProForm.Group>
        <ProForm.Group title="文章内容">
          <ProFormTextArea name="content" width="lg" />
        </ProForm.Group>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
          // setStepFormCurrentStep(0);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
        articleTypeValueEnum={articleTypeValueEnum}
      />
      <Drawer
        width={600}
        open={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.id && (
          <ProDescriptions<TableListItem>
            column={2}
            title={currentRow?.id}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.id,
            }}
            columns={columns as ProDescriptionsItemProps<TableListItem>[]}
          />
        )}
      </Drawer>
      <Modal
        title="预览新闻"
        open={articlePreview}
        onOk={() => {
          setArticlePreview(false);
        }}
        onCancel={() => {
          setArticlePreview(false);
        }}
        footer={[]}
      >
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </Modal>

      <Modal
        title="修改内容"
        open={articleEdit}
        onOk={() => {
          setArticleEdit(false);
          // actionRef.current?.reloadAndRest?.();
          // setArticle({});
        }}
        onCancel={() => {
          setArticleEdit(false);
          // actionRef.current?.reloadAndRest?.();
          // setArticle(undefined);
        }}
        footer={[]}
      >
        {/* <BasicForm article={{ ...articleRef.current }} articleId={articleId} /> */}
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

        <Button
          key="edit"
          onClick={async (value) => {
            const article2: TableListItem = {
              id: articleId,
              content: setImgWidth2Html(),
            };
            console.log('articleId:', articleId, 'content:', html);
            const success = await handleUpdate({}, article2);

            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow(undefined);
              // message.success('修改成功');

              if (actionRef.current) {
                actionRef.current.reload();
              }
            } else {
              // message.success('修改失败');
            }
            setArticleEdit(false);
          }}
          type="primary"
        >
          提交新闻
        </Button>
      </Modal>
    </PageContainer>
  );
};

export default TableList;
