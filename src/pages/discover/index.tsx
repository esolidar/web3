import { useState, useRef, Fragment, ChangeEvent, useCallback } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient } from 'react-query';
import { useContractKit } from '@celo-tools/use-contractkit';
import Title from '@esolidar/toolkit/build/unreleased/title';
import Breadcrumbs from '@esolidar/toolkit/build/elements/breadcrumbs';
import CardNonProfit from '@esolidar/toolkit/build/components/card/nonProfit';
import TextField from '@esolidar/toolkit/build/elements/textField';
import MultiSelectField from '@esolidar/toolkit/build/elements/multiSelectField';
import Button from '@esolidar/toolkit/build/elements/button';
import Icon from '@esolidar/toolkit/build/elements/icon';
import useDebounce from '@esolidar/toolkit/build/hooks/useDebounce';
import useIntersectionObserverInfiniteScroll from '@esolidar/toolkit/build/hooks/useIntersectionObserverInfiniteScroll';
import CustomModal from '@esolidar/toolkit/build/elements/customModal';
import Loading from '@esolidar/toolkit/build/components/loading';
import {
  useGetInstitutionListPrefetch,
  useGetInstitutionListInfinite,
} from '../../api/hooks/useGetInstitutionList';
import useGetSdg from '../../api/hooks/useGetSdg';
import { Sdg } from '../../interfaces/sdg';
import getRoute from '../../routes';
import Modals from '../../components/donationModal/Modals';

// TODO: gas price
// TODO: success / error das transactions

interface SdgOption {
  value: number;
  label: string;
}

let sdgOptions: SdgOption[] = [];
let institutionList: any = [];

const List = () => {
  const [isOpenDonationModal, setIsOpenDonationModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>('');
  const [odsId, setOdsId] = useState<SdgOption[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const intl: IntlShape = useIntl();
  const { address, connect } = useContractKit();
  const institutionWalletAddress = useRef('');
  const nonProfitName = useRef('');
  const router = useRouter();

  const { isLoading, isFetching, data, isFetchingNextPage, fetchNextPage, hasNextPage, status } =
    useGetInstitutionListInfinite({
      search: debouncedSearch,
      odsId,
      onSuccess: data => {
        setTotal(data.total);
        institutionList = data.pages;
      },
    });

  const loadMoreButtonRef = useRef();
  const [showLoadButton] = useIntersectionObserverInfiniteScroll({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
    page: data?.pages.length,
    root: null,
    status,
  });

  useGetSdg({
    onSuccess: data => {
      if (sdgOptions.length === 0) {
        sdgOptions = data.map((item: Sdg) => ({
          value: item.id,
          label: `${item.ods_id} - ${intl.formatMessage({ id: item.tag_name })}`,
        }));
      }
    },
  });

  const handleClickDonate = useCallback(
    (institution: any) => {
      nonProfitName.current = institution.name;
      institutionWalletAddress.current = institution.celo_wallet.find(
        (item: any) => item.default
      ).wallet_address;
      if (address) {
        setIsOpenDonationModal(true);
      } else {
        connect()
          .then(() => setIsOpenDonationModal(true))
          .catch((e: any) => console.log(e));
      }
    },
    [isOpenDonationModal]
  );

  const handleClickThumb = (institution: any) => {
    router.push(getRoute.nonProfit.DETAIL(String(router.locale), institution.id));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const odsLink = (): string => {
    if (String(router.locale) === 'pt') return 'https://www.ods.pt/';
    if (String(router.locale) === 'br') return 'https://brasil.un.org/pt-br/';
    return 'https://sdgs.un.org/goals';
  };

  return (
    <div className="home">
      <Breadcrumbs
        breadcrumbs={[
          {
            handleClick: () => router.push(getRoute.HOME(String(router.locale))),
            title: 'Home',
          },
          {
            title: intl.formatMessage({ id: 'web3.institution.list.title' }),
          },
        ]}
      />
      <Title
        subtitle={intl.formatMessage({ id: 'web3.institution.list.subtitle' })}
        title={intl.formatMessage({ id: 'web3.institution.list.title' })}
      />
      <div className="filters">
        <div className="filters__search">
          <TextField
            // size="md"
            onChange={handleSearch}
            value={search}
            placeholder="Search for nonprofits or causes..."
            field="term"
            leftIcon={{
              name: 'Search',
              show: true,
            }}
            rightIcon={
              search
                ? {
                    name: 'DeleteCircle',
                    onClick: () => setSearch(''),
                    show: true,
                  }
                : null
            }
          />
        </div>
        <div className="filters__field">
          <MultiSelectField
            name="sdg"
            onChange={(e: any) => setOdsId(e)}
            showSelectAll={false}
            valueText={intl.formatMessage({ id: 'projects.filter.ods' })}
            size="md"
            menuWidth="450px"
            value=""
            options={sdgOptions}
            labelHeader={
              <span className="sdg-description-title">
                <FormattedMessage id="sdg.description.1" />
                <Icon
                  name="InfoBold"
                  size="sm"
                  onClick={() => {
                    setOpenModal(true);
                  }}
                />
              </span>
            }
          />
        </div>
      </div>
      {isLoading && (
        <div className="loading-npo-list">
          <Loading />
          <h3>
            <FormattedMessage id="Searching..." />
          </h3>
          <p>
            <FormattedMessage id="Please wait while we are searching for “Walk” nonprofits or causes" />
          </p>
        </div>
      )}
      {total > 0 && !isLoading && (
        <div>
          <div className="npo-list-count">
            <FormattedMessage
              id="{total} nonprofits or causes"
              defaultMessage="{total} nonprofits or causes"
              values={{ total }}
            />{' '}
          </div>
          <div className="home__grid">
            {institutionList.map((page: any) => (
              <Fragment key={`npo-${page}`}>
                {page.map((institution: any) => (
                  <CardNonProfit
                    key={institution.id}
                    npo={institution}
                    onClickDonate={() => handleClickDonate(institution)}
                    onClickThumb={() => handleClickThumb(institution)}
                  />
                ))}
              </Fragment>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: '420px', display: 'flex', flexBasis: '420px' }}>
              <Button
                ref={loadMoreButtonRef}
                extraClass="secondary"
                fullWidth
                className={`${!showLoadButton && 'invisible'}`}
                size="lg"
                onClick={fetchNextPage}
                disabled={!hasNextPage || isFetchingNextPage}
                text={intl.formatMessage({ id: 'load.more' })}
                dataTestId="load-more"
              />
            </div>
          </div>
        </div>
      )}
      {!isFetching && total === 0 && !isLoading && (
        <div className="no-result-npo-list">
          <div style={{ width: '256px', height: '256px', margin: '0 auto' }} />
          <h3>
            <FormattedMessage id="Sorry, no results were found for your search" />
          </h3>
          <p>
            <FormattedMessage id="Please try other filters or use more general terms and parameters" />
          </p>
        </div>
      )}
      <Modals
        openModal={isOpenDonationModal}
        setOpenModal={setIsOpenDonationModal}
        walletAddress={institutionWalletAddress.current}
        nonProfitName={nonProfitName.current}
      />
      <CustomModal
        show={openModal}
        onHide={() => setOpenModal(false)}
        size="md"
        title={intl.formatMessage({ id: 'sdg.description' })}
        dialogClassName="sdg-description"
        backdrop="static"
        showFooter={false}
        bodyChildren={
          <>
            <p>
              <FormattedMessage id="sdg.description.text" />
            </p>
            <Button
              className="popover-btn m-0 p-0"
              extraClass="link"
              href={odsLink()}
              target="_blank"
              text={intl.formatMessage({ id: 'learn.more' })}
              size="sm"
            />
          </>
        }
      />
    </div>
  );
};

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await useGetInstitutionListPrefetch(queryClient);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default List;
