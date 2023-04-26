import {
  CaretDownFilled,
  DoubleRightOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { ProSettings } from '@ant-design/pro-components';
import {
  ProConfigProvider,
  ProLayout,
  SettingDrawer,
} from '@ant-design/pro-components';
import { Dropdown } from 'antd';
import React, { useState, useEffect } from 'react';
import defaultProps from './defaultProps';

import MyPageContainer from '../../components/MyPageContainer';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [settings, setSetting] = useState<Partial<ProSettings> | undefined>({
    fixSiderbar: true,
    layout: 'mix',
    // splitMenus: true,
  });
  const navigate = useNavigate();

  //历史记录
  const [pathname, setPathname] = useState('/db/publicdb');
  const [flag1, setFlag1] = useState(false)
  useEffect(() => {
    if (flag1) {
      sessionStorage.setItem('pathname', pathname)
    }
  }, [pathname])
  useEffect(() => {
    let path = sessionStorage.getItem('pathname')
    if (path) {
      setPathname(path)
      setFlag1(true)
    }
  }, [])
  return (
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
      <ProConfigProvider hashed={false}>
        <ProLayout
          {...settings}
          prefixCls="my-prefix"
          {...defaultProps}
          location={{
            pathname,
          }}
          siderMenuType="group"
          menu={{
            collapsedShowGroupTitle: true,
          }}
          avatarProps={{
            src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
            size: 'small',
            title: '管理员',
            render: (props, dom) => {
              return (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: <div onClick={() => { localStorage.clear(); navigate('/login'); }}>退出登录</div>,
                      },
                    ],
                  }}
                >
                  {dom}
                </Dropdown>
              );
            },
          }}
          menuFooterRender={(props) => {
            if (props?.collapsed) return undefined;
            return (
              <div
                style={{
                  textAlign: 'center',
                  paddingBlockStart: 12,
                }}
              >
                <div>© 2023 Made by FuriKuri</div>
                <div>by Ant Design</div>
              </div>
            );
          }}
          onMenuHeaderClick={(e) => { }}
          menuItemRender={(item, dom) => (
            <div
              onClick={() => {
                setPathname(item.path || '/welcome');
              }}
            >
              {dom}
            </div>
          )}
        >
          <MyPageContainer pathname={pathname} />

          <SettingDrawer
            pathname={pathname}
            enableDarkTheme
            getContainer={() => document.getElementById('test-pro-layout')}
            settings={settings}
            onSettingChange={(changeSetting) => {
              setSetting(changeSetting);
            }}
            disableUrlParams={false}
          />
        </ProLayout>
      </ProConfigProvider>
    </div>
  );
};
export default Home