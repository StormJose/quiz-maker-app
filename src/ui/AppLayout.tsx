import React from 'react'
import { Outlet, useNavigation } from 'react-router'
import BackLink from './BackLink'
import Header from './Header'
import Loader from './Loader'


export default function AppLayout() {

  const navigation = useNavigation()

  return ( 
    <div className='font-noto relative '>
      <Header/>
      <div className="p-4">
        <BackLink />
      </div>
      <main className="grid lg:max-w-[1440px] mx-auto my-0 ">
        {navigation.state === "loading" && <Loader/>}
        <Outlet />
      </main>
     
    </div>
  );
}
