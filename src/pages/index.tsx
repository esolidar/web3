import { FormattedMessage } from 'react-intl';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import HomeBanner from '../components/HomeBanner';

const DiscoverPage = () => (
  <>
    <HomeBanner />
    <Viewport centred size="xl">
      <div style={{ height: '1500px' }}>
        <FormattedMessage id="Home page" />
      </div>
    </Viewport>
  </>
);

export default DiscoverPage;
