import React, { useState, useRef } from 'react';
import { Button, message, Form } from 'antd';
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
import {
  setItemWithExpiration as setStorage,
  getItemWithExpiration as getStorage,
  removeItem,
  getItemWithExpiration,
} from '../../utils/localStorageUtil';

const QuickUpload: React.FC = () => {
  //便捷上传图片
  const [quickUploadImg, handleQuickUploadImg] = useState(false);
  const [form] = Form.useForm();

  return (
    <>
      <ModalForm
        title="上传图片"
        autoFocusFirstInput={true}
        visible={quickUploadImg}
        form={form}
        modalProps={{
          onOk: () => handleQuickUploadImg(false),
          onCancel: () => handleQuickUploadImg(false),
        }}
        submitter={{
          render: () => {
            return [
              <Button
                onClick={() => {
                  const imgUrl = form.getFieldValue('imgUrl');
                  //保证兼容性
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(imgUrl);
                  } else {
                    document.getElementById('imgUrl').select();
                    document.execCommand('copy', true);
                  }
                  message.info('已复制图片链接');
                }}
              >
                复制图片链接
              </Button>,
            ];
          },
        }}
      >
        <ProFormUploadButton
          //这个是修改表单的字段
          max={1}
          fieldProps={{
            maxCount: 1,
            accept: '.png,.jpg,.jpeg',
            multiple: true,
            //这个是上传图片的 后台参数名
            name: 'filedata',
            headers: { Authorization: 'bearer ' + getStorage('token') },
            beforeUpload: (file) => {
              //上传之前清空imgurl
              form.setFieldValue('imgUrl', '');
              //上传控制
              if (!['image/png', 'image/jpeg'].includes(file.type)) {
                message.error(`文件格式错误, 支持 PNG/JPG`);
                return false;
              } else if (file.name.length > 50) {
                message.error(`请选择名称在50字符以内的文件`);
                return false;
              } else if (file.size > 1024 * 1024) {
                //reader.onload和img.onload都是异步操作, 需要转为同步(否则会图片过大上传失败)
                console.log('初始文件大小:', file.size / 1024, 'KB');
                // return async () => {
                // await new Promise(() => {
                let rate = 0.2;
                const reader = new FileReader();
                reader.readAsDataURL(file);
                const img = new Image();
                reader.onload = function (e) {
                  img.src = e.target.result;
                };
                img.onload = function () {
                  const canvas = document.createElement('canvas');
                  const context = canvas.getContext('2d');
                  // 文件大小KB
                  const fileSizeKB = Math.floor(file.size / 1024);
                  // console.log('file size：', fileSizeKB, 'kb');
                  // 配置rate和maxSize的关系
                  if (fileSizeKB * rate > 3027) {
                    rate = Math.floor((3027 / fileSizeKB) * 10) / 30;
                  }
                  // 缩放比例，默认0.5
                  const targetW = (canvas.width = this.width * rate);
                  const targetH = (canvas.height = this.height * rate);
                  context?.clearRect(0, 0, targetW, targetH);
                  context?.drawImage(img, 0, 0, targetW, targetH);
                  canvas.toBlob((blob) => {
                    const newImage = new File([blob], file.name, {
                      type: file.type,
                    });
                    // return newImage;
                    console.log('压缩后文件大小:', newImage.size / 1024, 'KB');
                    if (newImage.size > 1024 * 1024) {
                      message.info('压缩后图片仍然大于1MB,可能上传失败');
                      return false;
                    } else {
                      form.setFieldValue('filedata', newImage);
                      return true;
                    }
                  });
                };
                // });
                // };
              }
            },
            onChange(info) {
              const status = info.file.status;
              if (status === 'done') {
                // 完成
                message.success('图片上传成功...');
                const imgUrl = info.file.response.data.url;
                form.setFieldValue('imgUrl', imgUrl);
              } else if (status === 'error') {
                // 错误
                message.error(`${info.file.name} 文件上传失败 (可能是图片过大)`);
              }
            },
          }}
          action="/api/content/upload/image"
        />

        <ProFormText
          id="imgUrl"
          name="imgUrl"
          label="图片链接"
          placeholder={'上传图片后即可获取链接'}
        />
      </ModalForm>

      {getStorage('token') != null ? (
        <Button
          type="primary"
          shape="circle"
          size="large"
          onClick={() => {
            handleQuickUploadImg(true);
          }}
          style={{ position: 'fixed', bottom: 50, right: 50 }}
        >
          +<br />
        </Button>
      ) : (
        ''
      )}
    </>
  );
};

export default QuickUpload;
