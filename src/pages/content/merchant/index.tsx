import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Input, Drawer, Select, Modal, Radio } from 'antd';
import React, { useState, useRef } from 'react';
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

  const supportStatus = [
    { label: '支持', value: 1 },
    { label: '不支持', value: 0 },
  ];

  const freeStatus = [
    { label: '免费', value: 1 },
    { label: '付费', value: 0 },
  ];

  //TODO: 2.修改数据展示
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '商户级别id',
      dataIndex: 'id',
      tip: '商户的基本标识',
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
      title: '商户名称',
      dataIndex: 'name',
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
      dataIndex: 'icon',
      title: '图标',
      valueType: 'image',
      hideInSearch: true,
    },
    {
      dataIndex: 'settlePrice',
      title: '入驻费用(元/年)',
    },
    {
      title: '商户级别',
      dataIndex: 'level',
      render: (dom, entity) => {
        return entity.level + ' 级';
      },
    },
    {
      dataIndex: 'isSupportTwoDomain',
      title: '是否支持二级域名',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'shopCount',
      title: '分店数量限制',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      dataIndex: 'isGiveOneDomain',
      title: '是否赠送一级域名',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不赠送',
        1: '赠送',
      },
    },
    {
      dataIndex: 'imageSpaceCapacity',
      title: '图片空间容量',
      hideInTable: true,
      hideInSearch: true,
      render: (dom, entity) => {
        return (entity.imageSpaceCapacity == null ? 0 : entity.imageSpaceCapacity) + ' MB';
      },
    },
    {
      dataIndex: 'isShopRecommend',
      title: '支持产品推荐',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportBasic',
      title: '支持基本功能',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportTraining',
      title: '支持上门培训',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isLimitProductCount',
      title: '限制产品数量',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不限制',
        1: '限制',
      },
    },
    {
      dataIndex: 'isSupportOnlineService',
      title: '支持在线客服',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportMapLabel',
      title: '支持地图标注',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportReviseLogo',
      title: '支持修改logo',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportReviseSign',
      title: '支持修改招牌',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isSupportSlideshow',
      title: '支持幻灯片广告',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不支持',
        1: '支持',
      },
    },
    {
      dataIndex: 'isLimitStyleCount',
      title: '限制风格',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '不限制',
        1: '限制',
      },
    },
    {
      dataIndex: 'isFreeCertified',
      title: '免费实地认证',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '付费',
        1: '免费',
      },
    },
    {
      dataIndex: 'isFreePromotion',
      title: '免费促销',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '付费',
        1: '免费',
      },
    },
    {
      dataIndex: 'isFreeMobileShop',
      title: '免费手机店铺',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '付费',
        1: '免费',
      },
    },
    {
      dataIndex: 'isFreeWechatWebsite',
      title: '免费微信网站',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '付费',
        1: '免费',
      },
    },
    {
      dataIndex: 'isFreeOnebyoneService',
      title: '免费1对1服务',
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        0: '付费',
        1: '免费',
      },
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          修改
        </a>,
        <a
          key="delete"
          onClick={async () => {
            await handleRemove([record]);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          删除
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
          <ProFormDigit
            name="level"
            label="商户级别"
            rules={[{ required: true, message: '商户级别' }]}
          />
          <ProFormText
            name="name"
            label="商户名称"
            rules={[{ required: true, message: '商户名称' }]}
          />
          <ProFormDigit name="settlePrice" label="入驻费用(万元)" />
          <ProFormText name="icon" label="商户级别图标" />
          <ProFormDigit name="shopCount" label="分店数量限制" />
          <ProFormDigit name="imageSpaceCapacity" label="图片空间容量(MB)" />
          <ProFormSelect
            name="isGiveOneDomain"
            label="是否赠送一级域名"
            options={[
              { label: '赠送', value: 1 },
              { label: '不赠送', value: 0 },
            ]}
            initialValue={statusOptions[1].value}
          />
          <ProFormSelect
            name="isLimitStyleCount"
            label="是否限制风格"
            options={[
              { label: '限制', value: 1 },
              { label: '不限制', value: 0 },
            ]}
            initialValue={statusOptions[0].value}
          />
          <ProFormSelect
            name="isLimitProductCount"
            label="是否限制产品数量"
            options={[
              { label: '限制', value: 1 },
              { label: '不限制', value: 0 },
            ]}
            initialValue={statusOptions[0].value}
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
        </ProForm.Group>
        <ProForm.Group title="支持信息">
          <ProFormSelect
            name="isSupportTwoDomain"
            label="是否支持二级域名"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isShopRecommend"
            label="支持产品推荐"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportBasic"
            label="支持基本功能"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportTraining"
            label="支持上门培训"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportOnlineService"
            label="支持在线客服"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportMapLabel"
            label="支持地图标注"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportReviseLogo"
            label="支持修改logo"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportReviseSign"
            label="支持修改招牌"
            options={supportStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isSupportSlideshow"
            label="支持幻灯片广告"
            options={supportStatus}
            initialValue={1}
          />
        </ProForm.Group>
        <ProForm.Group title="免费信息">
          <ProFormSelect
            name="isFreeCertified"
            label="免费实地认证"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreePromotion"
            label="免费促销"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeMobileShop"
            label="免费手机店铺"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeWechatWebsite"
            label="免费微信网站"
            options={freeStatus}
            initialValue={1}
          />
          <ProFormSelect
            name="isFreeOnebyoneService"
            label="免费1对1服务"
            options={freeStatus}
            initialValue={1}
          />
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
    </PageContainer>
  );
};

export default TableList;
