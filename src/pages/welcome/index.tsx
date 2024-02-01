import React from "react";
import { history } from "umi";
import { Button, Result } from "antd";
import { localesMessage } from "@/utils/common";
// import { ProTable } from '@ant-design/pro-components';

const App: React.FC = () => (
    <>
        <Result
            status="success"
            title={localesMessage("welcome")}
            subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
            extra={[
                <Button
                    type="primary"
                    key="console"
                    onClick={() => history.push("/home")}
                >
                    To Home
                </Button>,
                <Button key="buy">Buy Again</Button>,
            ]}
        />
        {/* <ProTable 
      columns={[
        {
          dataIndex: 'index',
          valueType: 'indexBorder',
          width: 48,
        },
        {
          title: 'title',
          dataIndex: 'title',
          copyable: true,
          ellipsis: true,
          tip: 'tips',
          formItemProps: {
            rules: [
              {
                required: true,
                message: 'no enpty',
              },
            ],
          },
        },
      ]}
    /> */}
    </>
);

export default App;
