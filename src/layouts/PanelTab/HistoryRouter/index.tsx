import { useCommonStore } from '@/hooks';
import { useEffect } from 'react';
import { history } from 'umi';

export default function( props: any ){
  const { commonState, set } = useCommonStore();
  
  useEffect(()=>{
      // console.log(commonState.historyRouter);

  },[commonState.historyRouter]);
  

  return <>
      {props.Outlet}
  </>
}