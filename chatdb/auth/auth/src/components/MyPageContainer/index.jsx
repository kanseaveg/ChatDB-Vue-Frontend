import React, { useEffect, useState, } from 'react'
import { Input, theme, Button, Upload, message, Form, Modal, Spin } from 'antd';
import {
  SearchOutlined, UploadOutlined
} from '@ant-design/icons';
import {
  PageContainer,
  ProCard,
} from '@ant-design/pro-components';
import PublicDb from '../PublicDb';
import UserDb from '../UserDb'
import Info from '../Info';
import History from '../History'
import Feedback from '../Feedback'
import serviceAxios from '../../request'
import URL from '../../env'

const MyPageContainer = ({ pathname }) => {
  const { token } = theme.useToken();
  const [searchValue, setSearchValue] = useState('')
  const [open, setOpen] = useState(false)
  let which = pathname.split('/')[pathname.split('/').length - 1]
  const onFinish = (values) => {
    serviceAxios.post('admin/user_manager/add_user', { data: values }).then((res) => {
      ;
      if (res.code === 200) {
        message.success('添加成功！')
        setOpen(false)
        setSearchValue('')
      } else {
        message.warning(res.data || res.msg)
      }
    })
  };
  const props = {
    name: 'file',
    action: `${URL}/admin/public_db/upload`,
    maxCount: 1,
    // showUploadList: false,
    accept: '.xlsx,.xls,.csv',
    onChange(info, event) {
      if (info.file.status === 'uploading') {
      }
      if (info.file.status === 'done') {
        if (info.file.response.code === 200) {
          setSearchValue(' ')
          message.success(`${info.file.name} file uploaded successfully`, 1);
        } else {
          message.warning(info.file.response.msg)
        }
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  }
  const Operate = ({ which, style, setSearchValue, setOpen }) => {
    const { token } = theme.useToken();
    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          ...style,
        }}
      >
        <SearchInput placeholder={which === 'publicdb' ?
          '输入id或dbName进行搜索' :
          which === 'userdb' ?
            '输入id或dbName或userId进行搜索' :
            which === 'info' ?
              '搜索'
              :
              which === 'history' ?
                '输入userId或chatId进行搜索'
                :
                which === 'feedback' ?
                  '输入userId或chatId或db进行搜索'
                  : ''} setSearchValue={setSearchValue} />
        {which === 'publicdb' ?
          <Upload {...props} >
            <Button icon={<UploadOutlined />}>上传公共库</Button>
          </Upload> :
          // which === 'userdb' ? <Upload {...props} action={`${URL}/admin/user_db/upload`} >
          //   <Button icon={<UploadOutlined />}>上传用户数据库</Button>
          // </Upload> :
          which === 'info' ?
            <Button onClick={() => setOpen(true)}>添加用户</Button>
            :
            which === 'history' ?
              ''
              :
              which === 'feedback' ? ''
                : ''
        }

      </div>
    );
  };
  const SearchInput = ({ placeholder, setSearchValue }) => {
    const { token } = theme.useToken();
    return (
      <div
        key="SearchOutlined"
        aria-hidden
        style={{
          display: 'flex',
          alignItems: 'center',
          marginInlineEnd: 24,
        }}
        onMouseDown={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
      >
        <Input
          style={{
            borderRadius: 4,
            marginInlineEnd: 12,
            backgroundColor: token.colorBgTextHover,
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { setSearchValue(e.target.value) }
          }}
          onChange={(e) => {
            if (!e.target.value) { setSearchValue('') }
          }}
          prefix={
            <SearchOutlined
              style={{
                color: token.colorTextLightSolid,
              }}
            />
          }
          placeholder={placeholder}
          bordered={false}
        />
      </div>
    );
  };
  return (
    <div
      style={{
        width: '100%',
      }}
    >
      <Modal
        title="新增用户"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{
            span: 5,
          }}
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          autoComplete="on"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
              {
                pattern: "^[\\u4e00-\\u9fa5a-zA-Z0-9]{4,12}$",
                message: '用户名必须为4-12位字母/数字/中文'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="密码"
            name="password"
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
              {
                pattern: "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$",
                message: '密码必须包含6-20个大小写字母、数字'

              }
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              {
                type: 'email',
                message: '邮箱格式错误!',
              },
              {
                required: true,
                message: '请输入您的邮箱!',
              },
            ]}
          >
            <Input />

          </Form.Item>
          <Form.Item
            name="phone"
            label="手机号码"
            rules={[
              {
                required: true,
                message: '请输入手机号码!',
              },
              {
                pattern: "^((13[0-9])|(14[0|5|6|7|9])|(15[0-3])|(15[5-9])|(16[6|7])|(17[2|3|5|6|7|8])|(18[0-9])|(19[1|8|9]))\\d{8}$",
                message: '手机号应为11位数字'
              }
            ]}
          >
            <Input
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="roleId"
            rules={[
              {
                required: true,
                message: '请输入roleId!',
              },
            ]}
          >
            <Input
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 10,
              span: 2,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      <PageContainer
        token={{
          paddingInlinePageContainerContent: 40,
        }}
        extra={<Operate which={which} setSearchValue={setSearchValue} setOpen={setOpen} />}
      >
        <ProCard
          style={{
            height: '100%',
            minHeight: 800,
            overflow: 'auto'
          }}
        >{which === 'publicdb' ? <PublicDb searchValue={searchValue} /> :
          which === 'userdb' ? <UserDb searchValue={searchValue} /> :
            which === 'info' ? <Info searchValue={searchValue} /> :
              which === 'history' ? <History searchValue={searchValue} /> :
                which === 'feedback' ? <Feedback searchValue={searchValue} /> : ''}
          <div />
        </ProCard>
      </PageContainer>
    </div>
  );
};
export default MyPageContainer