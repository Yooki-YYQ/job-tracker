import { ConfigProvider } from 'antd';
import { themeConfig } from '@/config/theme.config';
import { JobTrackerPage } from '@/pages';
import '@/styles';

export default function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      <JobTrackerPage />
    </ConfigProvider>
  );
}