import { FormattedMessage } from 'react-intl';
import Viewport from '@esolidar/toolkit/build/components/viewport';
import Hero from '../components/Hero';

const DiscoverPage = () => (
  <>
    <Hero />
    <Viewport centred size="xl">
      <div style={{ height: '1500px' }}>
        <FormattedMessage id="Home page" />
      </div>
    </Viewport>
  </>
);

export default DiscoverPage;
