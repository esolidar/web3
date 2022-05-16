import Icon from '@esolidar/toolkit/build/elements/icon';
import Dropdown from '@esolidar/toolkit/build/elements/dropdown';
import Button from '@esolidar/toolkit/build/elements/button';

const Footer = () => {
  const d = new Date();
  const year: number = d.getFullYear();

  return (
    <div className="footer-component">
      <div className="footer-component__copyright">
        Information provided is general and educational in nature. It is not intended to be, and
        should not be construed as, legal or tax advice. Rules and regulations regarding tax
        deductions for charitable giving vary at the country and state level, and laws of a specific
        country, state or laws relevant to a particular situation may affect the applicability,
        accuracy, or completeness of the information provided. Please consult a tax advisor about
        the legal or tax consequences of donating in cryptocurrency. All organization names, logos,
        and brands are property of their respective owners, and are used on this website for
        identification purposes only. Use of these names, logos, and brands does not imply
        endorsement.
      </div>

      <div className="footer-component__menu">
        <div>{`© ${year} esolidar. All rights reserved.`}</div>
        <div className="footer-component__menu-item">
          <a href="/" target="_blank">
            Privacy Policy
          </a>
        </div>
        <div className="footer-component__menu-item">
          <a href="/" target="_blank">
            Terms & Conditions
          </a>
        </div>
        <div className="footer-component__menu-item">
          <a href="/" target="_blank">
            Cookie Policy
          </a>
        </div>
        <div className="footer-component__menu-item-separator" />
        <div className="power-by-esolidar">
          Powered by <strong>esolidar</strong>
        </div>

        <div className="change-language">
          <div className="power-by-esolidar-mobile">
            Powered by <strong>esolidar</strong>
          </div>
          <div className="change-lang">
            <Icon name="Language" />
            <Dropdown
              customButton={
                <Button
                  extraClass="primary-full btn-change-lang"
                  ghost
                  iconRight={<Icon name="ChevronUp" />}
                  isLoading={false}
                  onClick={() => {}}
                  size="sm"
                  text="English"
                  theme="light"
                  type="button"
                  withLoading={false}
                />
              }
              items={[
                {
                  id: 0,
                  onClick: () => {},
                  text: 'Action',
                },
                {
                  id: 0,
                  onClick: () => {},
                  text: 'Action',
                },
                {
                  id: 0,
                  onClick: () => {},
                  text: 'Action',
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
