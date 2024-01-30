import type { MetaFunction } from '@remix-run/node';

import Search from '~/components/Search';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export default function Index() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <h1>Welcome to Remix</h1>
      <Search />
    </div>
  );
}
