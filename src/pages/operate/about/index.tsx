import { PlusOutlined, DownOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Select, Modal } from 'antd';
import type { TableColumnsType } from 'antd';
import { Badge, Dropdown, Space, Table, Form } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { FormValueType } from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import { rule, addRule, updateRule, removeRule, addItem, alterItem, deleteItem } from './service';
import type { TableListItem, TableListPagination, ValueItemType } from './data';
import type { ProFormInstance } from '@ant-design/pro-components';
import { initial, size } from 'lodash';

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
  const resetFormRef_Add = useRef<ProFormInstance>();
  const resetFormRef_Alter = useRef<ProFormInstance>();
  const [currentRow, setCurrentRow] = useState<TableListItem>();
  const [selectedRowsState, setSelectedRows] = useState<TableListItem[]>([]);
  /** 国际化配置 */

  //TODO: 2.修改数据展示
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '信息项id',
      dataIndex: 'id',
      tip: '信息项的基本标识',
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
      title: '信息项',
      width: 100,
      dataIndex: 'name',
      render: (item, index) => {
        return <b style={{}}>{item}</b>;
      },
    },
    {
      title: '配置值',
      dataIndex: 'value',
      ellipsis: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInForm: true,
      filters: true,
      onFilter: true,
      ellipsis: true,
      width: 100,
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
      align: 'center',
      width: 250,
      render: (_, record) => [
        <a
          key="addItem"
          onClick={() => {
            handleAddValueItemOpen(true);
            setCurrentRow(record);
          }}
        >
          新增配置项
        </a>,
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          快捷修改
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

  const statusOptions = [
    { label: '使用中', value: 1 },
    { label: '未启用', value: 0 },
  ];

  const restFormRef = useRef<ProFormInstance>();

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

  const [isAddValueItemOpen, handleAddValueItemOpen] = useState(false);
  const [isAlterValueItemOpen, handleAlterValueItemOpen] = useState(false);

  const [valueItem, setValueItem] = useState({});

  const expandedRowRender = (record_p, index_p, indent_p, expanded_p) => {
    const columns2: TableColumnsType<ValueItemType> = [
      { title: '标识', dataIndex: 'itemId', key: 'itemId', width: 100, align: 'center' },
      { title: '配置项', dataIndex: 'key', key: 'key', width: 150 },
      { title: '配置值', dataIndex: 'value', key: 'value', ellipsis: true },
      {
        title: '图像',
        dataIndex: 'image',
        key: 'image',
        align: 'center',
        width: 200,
        render: (image) => <img src={image} height={100} />,
      },
      {
        title: '排序字段',
        dataIndex: 'sort',
        key: 'sort',
        width: 100,
        align: 'center',
        sorter: (a, b) => {
          return a.sort - b.sort;
        },
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 150,
        render: (value: any, record: ValueItemType, index: number) => (
          <Space size="middle">
            <a
              onClick={(e) => {
                console.log('resetFormRef_Alter', resetFormRef_Alter);
                console.log('resetFormRef_Alter_record', record);
                handleAlterValueItemOpen(true);
                setValueItem(record);
                resetFormRef_Alter.current?.setFieldValue('optionId', record.optionId);
                resetFormRef_Alter.current?.setFieldValue('itemId', record.itemId);
                resetFormRef_Alter.current?.setFieldValue('key', record.key);
                resetFormRef_Alter.current?.setFieldValue('value', record.value);
                resetFormRef_Alter.current?.setFieldValue('image', record.image);
                resetFormRef_Alter.current?.setFieldValue('sort', record.sort);
              }}
            >
              修改
            </a>
            <a
              onClick={async () => {
                const result = await deleteItem(record);
                {
                  if (result.msg == 'success') {
                    message.success('删除成功');
                    actionRef?.current?.reloadAndRest();
                  } else {
                    message.error('删除失败');
                  }
                }
              }}
            >
              删除
            </a>
          </Space>
        ),
      },
    ];

    let data: ValueItemType[] = [];
    try {
      data = JSON.parse(record_p.value);
      return <Table columns={columns2} dataSource={data} pagination={false} />;
    } catch {}
  };

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        // scroll={{ x: 'max-content' }}
        search={{
          labelWidth: 70,
        }}
        expandable={{
          expandedRowRender: (record, index, indent, expanded) => {
            return expandedRowRender(record, index, indent, expanded);
          },
          defaultExpandedRowKeys: ['0'],
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
            <PlusOutlined /> 新增信息项
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

      <ModalForm
        formRef={resetFormRef_Alter}
        title="修改配置项"
        visible={isAlterValueItemOpen}
        initialValues={valueItem}
        onVisibleChange={(visiable) => {
          handleAlterValueItemOpen(visiable);
        }}
        onFinish={async (value) => {
          const result = await alterItem({ ...value } as ValueItemType);
          if ((result.success = 'success')) {
            message.success('修改成功');
          } else {
            message.error('修改失败');
          }
          handleAlterValueItemOpen(false);
          actionRef.current?.reloadAndRest?.();
          resetFormRef_Alter.current?.resetFields();
        }}
      >
        <ProFormText label="信息项id" name="optionId" hidden />
        <ProFormText label="配置项id" name="itemId" hidden />
        <ProFormText label="配置项" name="key" />
        <ProFormTextArea label="配置值" name="value" width="xl" />
        <ProFormText label="图像&nbsp;&nbsp;&nbsp;&nbsp;" name="image" width="xl" />
        <ProFormDigit label="排序字段" name="sort" />
      </ModalForm>

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
        formRef={resetFormRef_Add}
        title="新增配置项"
        visible={isAddValueItemOpen}
        onVisibleChange={(visiable) => {
          handleAddValueItemOpen(visiable);
          resetFormRef_Add.current?.resetFields();
        }}
        onFinish={async (value) => {
          const result = await addItem({ optionId: currentRow?.id, ...value } as ValueItemType);
          if ((result.success = 'success')) {
            message.success('添加成功');
          } else {
            message.error('添加失败');
          }
          handleAddValueItemOpen(false);
          actionRef.current?.reloadAndRest?.();
        }}
      >
        <ProFormText label="配置项" name="key" />
        <ProFormTextArea label="配置值" name="value" width="xl" />
        <ProFormText label="图像&nbsp;&nbsp;&nbsp;&nbsp;" name="image" width="xl" />
      </ModalForm>

      <ModalForm
        title="新增信息项"
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
          if (value.value == null || value.value == '') {
            value.value = '[]';
          }
          try {
            console.log('value.value', value.value);
            JSON.parse(value.value);
          } catch {
            message.info('信息项设置有误');
            return;
          }
          const success = await handleAdd(value as TableListItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current?.reloadAndRest?.();
            }
          }
        }}
        layout={'vertical'}
      >
        {/* TODO: 4.修改新增表单 */}

        <ProForm.Group title="基本信息">
          <ProFormText
            name="name"
            width={'xl'}
            label="信息项"
            rules={[{ required: true, message: '信息项' }]}
          />
          <ProFormTextArea
            width={'xl'}
            name="value"
            label="信息值"
            placeholder={'如果不清楚JSON写法, 建议先不填'}
          />
          <ProFormSelect
            name="status"
            label="状态"
            options={statusOptions}
            initialValue={statusOptions[0].value}
          />
        </ProForm.Group>
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          try {
            JSON.parse(value.value);
          } catch {
            message.info('信息项设置有误');
            return;
          }
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
            actionRef?.current?.reload();
            message.success('修改成功');
          } else {
            message.error('修改失败');
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
