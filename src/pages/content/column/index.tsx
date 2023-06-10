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
import { tree, rule, addRule, updateRule, removeRule } from './service';
import type { TableListItem, TableListPagination } from './data';
import type { ProFormInstance } from '@ant-design/pro-components';
import { initial } from 'lodash';

import handleRequest from '../../../utils/handleRequest';

//树形控件
import { Tree, Space } from 'antd';
import type { DataNode, TreeProps } from 'antd/es/tree';
import QuickUpload from '@/components/QuickUpload';

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
      //兼容 列表中删除和树形中删除
      key: selectedRows.map((row) => (row.id != null ? row.id : row)),
    }),
    '删除成功',
  );
};

const TableList: React.FC = () => {
  const [treeData, setTreeData] = useState([]);

  const fetchData = async (columnId: number) => {
    const result = await handleTree(columnId);
    console.log('fetchData:', result);
    setTreeData(result);
  };

  // useEffect(() => {
  //   fetchData(0);
  // }, []);

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

  //TODO: 2.修改数据展示
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '栏目id',
      dataIndex: 'id',
      tip: '栏目的基本标识',
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
      title: '栏目名称',
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
      title: '上级栏目id',
      dataIndex: 'pid',
      sorter: (a, b) => {
        return a.pid - b.pid;
      },
    },
    {
      title: '栏目图标',
      dataIndex: 'icon',
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '层级顺序',
      dataIndex: 'sort',
      hideInSearch: true,
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

  //树形控件Tree
  const [showTreeModal, handleShowTreeModal] = useState(false);
  const [isSort, setIsSort] = useState(false);
  const [isAlter, setIsAlter] = useState(false);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  function convertChildren(subMenu) {
    if (!subMenu || subMenu.length === 0) {
      return null;
    }

    return subMenu.map((item, index) => {
      return {
        title: item.name,
        key: item.id,
        children: convertChildren(item.subMenu),
      };
    });
  }

  const handleTree = async (columnId: number) => {
    const result = await tree({ columnId });
    if (result.code == 0 && result.successful == true) {
      const convertedData = convertChildren(result.result);
      console.log('tree:', result.result);
      console.log('convertedData:', convertedData);

      return convertedData;
    } else {
      message.error('数据请求失败');
      return null;
    }
  };

  const onExpand: TreeProps['onExpand'] = (expandedKeys2, info) => {
    console.log('expandedKeys2:', expandedKeys2, 'info:', info);
    const newExp = expandedKeys;
    expandedKeys2.map((key) => {
      if (!expandedKeys.includes(key)) {
        newExp.push(key);
      }
    });
    console.log('newExp:', newExp);
    setExpandedKeys(newExp);
    console.log('expandedKeys:', expandedKeys);
  };

  const onSelect: TreeProps['onSelect'] = (selectedKeys2, info) => {
    console.log('selected', selectedKeys2, info);
  };

  const onCheck: TreeProps['onCheck'] = (checkedKeys2, info) => {
    console.log('onCheck', checkedKeys2, info);
    setCheckedKeys(checkedKeys2);
  };

  const onDragEnter: TreeProps['onDragEnter'] = (info) => {
    console.log('onDragEnter', info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = (info) => {
    console.log('onDrop', info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...treeData];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setTreeData(data);
  };

  return (
    <>
      <PageContainer>
        <ProTable<TableListItem, TableListPagination>
          headerTitle="查询表格"
          actionRef={actionRef}
          rowKey="id"
          scroll={{ x: 'max-content' }}
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
                //获取树形数据
                fetchData(0);
                handleShowTreeModal(true);
              }}
            >
              树形展示
            </Button>,
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
          // 取消选择框
          // rowSelection={{
          //   onChange: (_, selectedRows) => {
          //     setSelectedRows(selectedRows);
          //     console.log('selectedRows', selectedRows.length);
          //   },
          // }}
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
        <Modal
          title="树形展示"
          open={showTreeModal}
          onOk={() => {
            handleShowTreeModal(false);
          }}
          onCancel={() => {
            handleShowTreeModal(false);
            //刷新列表
            actionRef.current?.reloadAndRest?.();
          }}
          footer={[
            <Button
              key="check"
              type="primary"
              onClick={() => {
                setIsAlter(!isAlter);
              }}
            >
              多选
            </Button>,
            <Button
              key="treeDelete"
              danger
              onClick={() => {
                handleRemove(checkedKeys);
                //请求两次, 才能及时更新(否则可能不会重新渲染为最新值)
                fetchData(0);
                fetchData(0);
              }}
            >
              删除节点
            </Button>,
            // <Button
            //   key="treeAlter"
            //   type="primary"
            //   onClick={() => {
            //     handleShowTreeModal(false);
            //   }}
            // >
            //   确认修改
            // </Button>,
            // <Button
            //   key="treeCancle"
            //   onClick={() => {
            //     handleShowTreeModal(false);
            //   }}
            // >
            //   关闭
            // </Button>,
          ]}
        >
          {/* <div>
            <Space align="center">
              <Button
                type="primary"
                onClick={() => {
                  setIsSort(!isSort);
                }}
              >
                调换顺序
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setIsAlter(!isAlter);
                }}
              >
                多选
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  let keys: number[] = [];
                  treeData.forEach((item) => {
                    keys.push(item.key);
                    if (item.children != null && item.children != undefined) {
                      item.children.forEach((item2) => {
                        keys.push(item2.key);
                      });
                    }
                  });
                  console.log('keys:', keys);
                  setExpandedKeys(keys);
                }}
              >
                展开所有
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  setExpandedKeys([]);
                }}
              >
                折叠所有
              </Button>
            </Space>
          </div>
          <br /> */}
          {treeData.length > 0 && (
            <Tree
              // 虚拟滚动
              height={500}
              showLine
              checkable={isAlter}
              blockNode
              draggable={isSort}
              // autoExpandParent
              defaultExpandAll={true}
              // defaultExpandParent
              switcherIcon={<DownOutlined />}
              // expandedKeys={expandedKeys}
              // defaultSelectedKeys={['0-0-0', '0-0-1']}
              // defaultCheckedKeys={['0-0-0', '0-0-1']}
              onExpand={onExpand}
              onSelect={onSelect}
              onCheck={onCheck}
              onDragEnter={onDragEnter}
              onDrop={onDrop}
              treeData={treeData}
            />
          )}
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
              name="name"
              label="栏目名"
              rules={[{ required: true, message: '栏目名' }]}
            />
            <ProFormDigit
              name="pid"
              label="上级栏目id"
              rules={[{ required: true, message: '上级栏目id' }]}
            />
            <ProFormText name="icon" label="栏目图标" />
            <ProFormDigit name="sort" label="层级顺序" />
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
    </>
  );
};

export default TableList;
