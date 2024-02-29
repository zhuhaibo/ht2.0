// /**
//  * @see https://umijs.org/docs/max/access#access
//  * */
export default function (initialState: { resource: string[] }) {
  const { resource } = initialState || { resource: [] };
  const access: any = {};
  resource?.forEach((x) => {
    access[x] = true;
  });
  return access;
}

// export default function access(initialState: { currentUser?: API.CurrentUser } | undefined) {
//   const { currentUser } = initialState ?? {};
//   return {
//     canAdmin: currentUser && currentUser.access === 'admin',
//   };
// }
