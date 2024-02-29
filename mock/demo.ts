const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;

/**
 * 当前用户的权限，如果为空代表没登录
 * current user access， if is '', user need login
 * 如果是 pro 的预览，默认是有权限的
 */
let access = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site' ? 'admin' : '';

const getAccess = () => {
  return access;
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  'POST /api/demoTable': async (req: Request, res: Response) => {
    await waitTime(500);
    res.send({
      code: 200,
      message: 'OK',
      body: {
        content: [
          {
            "id": 624748504,
            "number": 6689,
            "title": "🐛 [BUG]yarn install命令 antd2.4.5会报错",
            "labels": [
                {
                    "name": "bug",
                    "color": "error"
                }
            ],
            "state": "open",
            "locked": false,
            "comments": 1,
            "created_at": "2020-05-26T09:42:56Z",
            "updated_at": "2020-05-26T10:03:02Z",
            "closed_at": null,
            "author_association": "NONE",
            "user": "chenshuai2144",
            "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          },
          {
            "id": 624691229,
            "number": 6688,
            "title": "🐛 [BUG]无法创建工程npm create umi",
            "labels": [
                {
                    "name": "bug",
                    "color": "error"
                }
            ],
            "state": "open",
            "locked": false,
            "comments": 0,
            "created_at": "2020-05-26T08:19:22Z",
            "updated_at": "2020-05-26T08:19:22Z",
            "closed_at": null,
            "author_association": "NONE",
            "user": "chenshuai2144",
            "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          },
          {
            "id": 624674790,
            "number": 6685,
            "title": "🧐 [问题] build 后还存在 es6 的代码（Umi@2.13.13）",
            "labels": [
                {
                    "name": "question",
                    "color": "success"
                }
            ],
            "state": "open",
            "locked": false,
            "comments": 0,
            "created_at": "2020-05-26T07:54:25Z",
            "updated_at": "2020-05-26T07:54:25Z",
            "closed_at": null,
            "author_association": "NONE",
            "user": "chenshuai2144",
            "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          },
          {
            "id": 624620220,
            "number": 6683,
            "title": "2.3.1版本如何在业务页面修改头部状态",
            "labels": [
                {
                    "name": "question",
                    "color": "success"
                }
            ],
            "state": "open",
            "locked": false,
            "comments": 2,
            "created_at": "2020-05-26T05:58:24Z",
            "updated_at": "2020-05-26T07:17:39Z",
            "closed_at": null,
            "author_association": "NONE",
            "user": "chenshuai2144",
            "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          },
          {
            "id": 624592471,
            "number": 6682,
            "title": "hideChildrenInMenu设置后，子路由找不到了",
            "labels": [
                {
                    "name": "bug",
                    "color": "error"
                }
            ],
            "state": "open",
            "locked": false,
            "comments": 2,
            "created_at": "2020-05-26T04:25:59Z",
            "updated_at": "2020-05-26T08:00:51Z",
            "closed_at": null,
            "author_association": "NONE",
            "user": "chenshuai2144",
            "avatar": "https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png"
          }
        ],
        currentPage: 1,
        totalElements: 12742,
        totalPages: 638
      },
      ok: true,
    });
  },
  // 支持值为 Object 和 Array
  // 'GET /api/currentUser': (req: Request, res: Response) => {
  //   if (!getAccess()) {
  //     res.status(401).send({
  //       data: {
  //         isLogin: false,
  //       },
  //       errorCode: '401',
  //       errorMessage: '请先登录！',
  //       success: true,
  //     });
  //     return;
  //   }
  //   res.send({
  //     success: true,
  //     data: {
  //       name: 'HB.Z',
  //       avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
  //       userid: '00000001',
  //       email: 'antdesign@alipay.com',
  //       signature: '海纳百川，有容乃大',
  //       title: '交互专家',
  //       group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
  //       tags: [
  //         {
  //           key: '0',
  //           label: '很有想法的',
  //         },
  //         {
  //           key: '1',
  //           label: '专注设计',
  //         },
  //         {
  //           key: '2',
  //           label: '辣~',
  //         },
  //         {
  //           key: '3',
  //           label: '大长腿',
  //         },
  //         {
  //           key: '4',
  //           label: '川妹子',
  //         },
  //         {
  //           key: '5',
  //           label: '海纳百川',
  //         },
  //       ],
  //       notifyCount: 12,
  //       unreadCount: 11,
  //       country: 'China',
  //       access: getAccess(),
  //       geographic: {
  //         province: {
  //           label: '浙江省',
  //           key: '330000',
  //         },
  //         city: {
  //           label: '杭州市',
  //           key: '330100',
  //         },
  //       },
  //       address: '西湖区工专路 77 号',
  //       phone: '0752-268888888',
  //     },
  //   });
  // },
  // // GET POST 可省略
  // 'GET /api/users': [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     age: 32,
  //     address: 'New York No. 1 Lake Park',
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     age: 42,
  //     address: 'London No. 1 Lake Park',
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     age: 32,
  //     address: 'Sidney No. 1 Lake Park',
  //   },
  // ],
  // 'POST /api/auth/captcha': async (req: Request, res: Response) => {
  //   await waitTime(500);
  //   res.send({
  //     code: 200,
  //     message: 'OK',
  //     body: {
  //       id: 'eb906946-3858-4e0b-9c30-92ac7bf373d5',
  //       image:
  //         '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',
  //     },
  //     ok: true,
  //   });
  // },
  // 'POST /api/login/account': async (req: Request, res: Response) => {
  //   const { password, username, type } = req.body;
  //   await waitTime(500);
  //   if (password === 'asdasd' && username === 'admin') {
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'admin',
  //     });
  //     access = 'admin';
  //     return;
  //   }
  //   if (password === 'asdasd' && username === 'user') {
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'user',
  //     });
  //     access = 'user';
  //     return;
  //   }
  //   if (type === 'mobile') {
  //     res.send({
  //       status: 'ok',
  //       type,
  //       currentAuthority: 'admin',
  //     });
  //     access = 'admin';
  //     return;
  //   }
  //   res.send({
  //     status: 'error',
  //     type,
  //     currentAuthority: 'guest',
  //   });
  //   access = 'guest';
  // },
  // 'POST /api/login/outLogin': (req: Request, res: Response) => {
  //   access = '';
  //   res.send({ data: {}, success: true });
  // },
  // 'POST /api/register': (req: Request, res: Response) => {
  //   res.send({ status: 'ok', currentAuthority: 'user', success: true });
  // },
  // 'GET /api/500': (req: Request, res: Response) => {
  //   res.status(500).send({
  //     timestamp: 1513932555104,
  //     status: 500,
  //     error: 'error',
  //     message: 'error',
  //     path: '/base/category/list',
  //   });
  // },
  // 'GET /api/404': (req: Request, res: Response) => {
  //   res.status(404).send({
  //     timestamp: 1513932643431,
  //     status: 404,
  //     error: 'Not Found',
  //     message: 'No message available',
  //     path: '/base/category/list/2121212',
  //   });
  // },
  // 'GET /api/403': (req: Request, res: Response) => {
  //   res.status(403).send({
  //     timestamp: 1513932555104,
  //     status: 403,
  //     error: 'Forbidden',
  //     message: 'Forbidden',
  //     path: '/base/category/list',
  //   });
  // },
  // 'GET /api/401': (req: Request, res: Response) => {
  //   res.status(401).send({
  //     timestamp: 1513932555104,
  //     status: 401,
  //     error: 'Unauthorized',
  //     message: 'Unauthorized',
  //     path: '/base/category/list',
  //   });
  // },
};
