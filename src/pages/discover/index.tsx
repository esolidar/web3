import { useState, useRef, Fragment, ChangeEvent, useCallback, useEffect } from 'react';
import { FormattedMessage, useIntl, IntlShape } from 'react-intl';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
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
import addUrlParam from '@esolidar/toolkit/build/utils/addUrlParam';
import getUrlParam from '@esolidar/toolkit/build/utils/getUrlParam';
import removeUrlParam from '@esolidar/toolkit/build/utils/removeUrlParam';
import {
  useGetInstitutionListPrefetch,
  useGetInstitutionListInfinite,
} from '../../api/hooks/useGetInstitutionList';
import useGetSdg from '../../api/hooks/useGetSdg';
import { Sdg } from '../../interfaces/sdg';
import getRoute from '../../routes';
import Modals from '../../components/donationModal/Modals';
import odsExternasLinks from '../../constants/odsExternalLinks';

interface SdgOption {
  value: number;
  label: string;
}

const getTranslatedSDGArray = (array: any, intl: any) =>
  array?.map((sdg: Sdg) => ({
    value: sdg.id,
    label: `${sdg.ods_id}. ${intl.formatMessage({ id: sdg.tag_name })}`,
  }));

const List = () => {
  const intl: IntlShape = useIntl();
  const queryClient = useQueryClient();
  const { address, connect } = useContractKit();
  const institutionWalletAddress = useRef('');
  const nonProfitName = useRef('');
  const nonProfitId = useRef(null);
  const router = useRouter();

  const [isOpenDonationModal, setIsOpenDonationModal] = useState<boolean>(false);
  const [search, setSearch] = useState<string | undefined>(getUrlParam('search') || '');
  const [odsId, setOdsId] = useState<any>(
    getUrlParam('ods') ? decodeURIComponent(getUrlParam('ods')).split(',') : []
  );
  const [osdFilterValue, setOsdFilterValue] = useState<any>([]);

  const [institutionList, setInstitutionList] = useState<any>({});
  const [openModal, setOpenModal] = useState<boolean>(false);
  const debouncedSearch = useDebounce(search, 500);

  const { data: sdgList } = useGetSdg({
    onSuccess: data => {
      if (odsId.length > 0) {
        setOsdFilterValue(
          getTranslatedSDGArray(
            data.filter((sdg: any) => odsId.includes(String(sdg.id))),
            intl
          )
        );
      }
    },
  });

  const { isLoading, isFetching, isFetchingNextPage, fetchNextPage, hasNextPage, status } =
    useGetInstitutionListInfinite({
      search: debouncedSearch,
      odsId,
      onSuccess: data => {
        setInstitutionList(data);
      },
    });

  const loadMoreButtonRef = useRef();
  const [showLoadButton] = useIntersectionObserverInfiniteScroll({
    target: loadMoreButtonRef,
    onIntersect: fetchNextPage,
    enabled: hasNextPage,
    page: institutionList?.pages?.length,
    root: null,
    status,
  });

  const handleClickDonate = useCallback(
    (institution: any) => {
      nonProfitName.current = institution.name;
      nonProfitId.current = institution.id;
      institutionWalletAddress.current = institution.celo_wallet.find(
        (item: any) => item.default
      ).wallet_address;

      if (address) setIsOpenDonationModal(true);
      else
        connect()
          .then(() => setIsOpenDonationModal(true))
          .catch((e: any) => console.log(e));
    },
    [isOpenDonationModal, address]
  );

  useEffect(() => {
    queryClient.setQueryData('celoWalletBalance', 0);
  }, []);

  useEffect(() => {
    if (search) addUrlParam('search', search);
    else removeUrlParam('search');
  }, [search]);

  useEffect(() => {
    if (odsId.length > 0) addUrlParam('ods', encodeURIComponent(odsId.join(',')));
    else removeUrlParam('ods');
  }, [odsId]);

  const handleClickThumb = (institution: any) => {
    router.push(getRoute.nonProfit.DETAIL(String(router.locale), institution.id));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleFilterOds = (e: SdgOption[]) => {
    setOsdFilterValue(e);
    setOdsId(e.flatMap((ods: SdgOption) => ods.value));
  };

  const { total } = institutionList;
  const odsFilterOptions = getTranslatedSDGArray(sdgList, intl);

  return (
    <div>
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
            onChange={handleSearch}
            value={search}
            placeholder={intl.formatMessage({ id: 'web3.seach.placeholder' })}
            field="term"
            leftIcon={{
              name: 'Search',
              show: true,
            }}
            rightIcon={
              search
                ? {
                    name: 'DeleteCircleBold',
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
            onChange={handleFilterOds}
            showSelectAll={false}
            valueText={intl.formatMessage({ id: 'projects.filter.ods' })}
            size="md"
            menuWidth="450px"
            value={osdFilterValue}
            options={odsFilterOptions}
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
      {isLoading && search === '' && (
        <div className="loading-npo-list">
          <Loading />
          <h3>
            <FormattedMessage id="Loading..." />
          </h3>
        </div>
      )}
      {isLoading && search !== '' && (
        <div className="loading-npo-list">
          <Loading />
          <h3>
            <FormattedMessage id="web3.searching" />
          </h3>
          <p>
            <FormattedMessage id="web3.searching.message" values={{ search }} />
          </p>
        </div>
      )}
      {total > 0 && !isLoading && (
        <div>
          <div className="npo-list-count">
            {total} <FormattedMessage id="web3.seach.results" />
          </div>
          <div className="list__grid">
            {institutionList?.pages.map((page: any) => (
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
        nonProfitId={nonProfitId.current}
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
              href={odsExternasLinks[String(router.locale)] || odsExternasLinks.en}
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

  await useGetInstitutionListPrefetch({ queryClient });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 10,
  };
};

export default List;
