import { FormattedMessage } from 'react-intl';

interface Props {
  color: 'green' | 'yellow';
  title: string;
  description: string;
  image: string;
}

const HomeCallout = ({ color = 'green', title, description, image }: Props) => (
  <div className={`home-callout home-callout--${color}`}>
    <h2 className="home-callout__title">
      <FormattedMessage id={title} />
    </h2>
    <p className="home-callout__description">
      <FormattedMessage id={description} />
    </p>
    <div className="home-callout__footer" style={{ backgroundImage: `url(${image})` }} />
  </div>
);

export default HomeCallout;
