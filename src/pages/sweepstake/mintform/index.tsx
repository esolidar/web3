import React, { useState } from 'react';
import axios from 'axios';
import { AbiItem } from 'web3-utils';
import { useContractKit } from '@celo-tools/use-contractkit';
import Button from '@esolidar/toolkit/build/elements/button';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import { String } from 'aws-sdk/clients/acm';
import { string0To255 } from 'aws-sdk/clients/customerprofiles';
import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json';
import { sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert';
import Navbar from '../../../components/sweepstake/Navbar';

const MintForm = () => {
  const { performActions, address, kit } = useContractKit();

  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
    ERC721EsolidarSweepstake as AbiItem[],
    process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  );

  const [file, setFile] = useState<any>(null);
  const [mediaSrc, setMediaSrc] = useState<String>('');
  const [urlPreviewFile, setUrlPreviewFile] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [propOne, setPropOne] = useState<string>('');
  const [propTwo, setPropTwo] = useState<string>('');
  const [propThree, setPropThree] = useState<string>('');
  const [duration, setDuration] = useState<number>(0);
  const [token, setToken] = useState<string0To255>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const fileHandleChange = (event: any) => {
    // Verify if the user cancel the file
    if (event.target.files[0] === undefined || event.target.files[0] == null) return;

    const viewFileTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'video/mp4',
      'video/ogg',
      'audio/mp3',
      'audio/mpeg',
    ];

    if (
      event.target.value.includes(
        viewFileTypes[0] ||
          viewFileTypes[1] ||
          viewFileTypes[2] ||
          viewFileTypes[3] ||
          viewFileTypes[4] ||
          viewFileTypes[5]
      )
    )
      return;

    if (event.target.files[0].size / (1024 * 1024) > 50) {
      setErrorMessage('File cannot be greater than 50MB');
      return;
    }

    if (
      ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'].includes(
        event?.target.files[0].type
      )
    )
      setUrlPreviewFile(URL.createObjectURL(event.target.files[0]));

    if (['audio/mp3', 'audio/mpeg', 'video/mp4', 'video/ogg'].includes(event?.target.files[0].type))
      setMediaSrc(URL.createObjectURL(event.target.files[0]));

    // Save file states
    setFile(event.target.files[0]);
  };

  const processValues = async () => {
    const MINTER = await contractERC721EsolidarSweepstake.methods
      .hasRole(process.env.NEXT_PUBLIC_MINTER_ROLE, address)
      .call();
    if (MINTER === false) {
      setErrorMessage('You must be a charity to perform this action');
      return;
    }

    await performActions(async kit => {
      const totalBalance = await kit.getTotalBalance(String(address));
      if (!(Number(totalBalance) > 0)) setErrorMessage("You don't have enough CELO to mint");
    });

    setErrorMessage('');

    try {
      const attributes = [
        { trait_type: 'prop1', value: propOne },
        { trait_type: 'prop2', value: propTwo },
        { trait_type: 'prop3', value: propThree },
      ];

      // Send file to IPFS
      const formDataFile = new FormData();
      formDataFile.append('file', file);

      let respFile = null;
      let formData = new FormData();
      formData.append('file', file);

      try {
        const resp = await axios.post('/api/ipfs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        respFile = resp.data;
      } catch (e) {
        console.log(e);
      }

      // Generate metadata json
      const metadataJson = {
        image: `ipfs://${respFile.ipfs}`,
        external_url: process.env.NEXT_PUBLIC_S3_URL + respFile.filename,
        name: title,
        description,
        attributes,
      };

      formData = new FormData();
      formData.append('metadata', JSON.stringify(metadataJson));

      // Mint tokenURI respMetadado
      await performActions(async () => {
        const resp = await axios.post('/api/ipfs', formData);
        const { tokenUri } = resp.data;

        const gasLimit = await contractERC721EsolidarSweepstake.methods
          .mint(tokenUri, token, Number(duration) * 60)
          .estimateGas();

        const res = await contractERC721EsolidarSweepstake.methods
          .mint(tokenUri, token, Number(duration) * 60)
          .send({ from: address, gasLimit });

        sweetAlertSuccess('Your campaign was created successfully!', '');

        setTimeout(() => {
          window.location.href = `/sweepstake/${res.events.Transfer.returnValues.tokenId}`;
        }, 2000);
      });
    } catch (e: any) {
      // If Generic error
      if (e.message === 'Internal JSON-RPC error.')
        setErrorMessage('Error interacting with the smart contract');

      if (e.message) {
        setErrorMessage(e.message);
        return;
      }
      if (e.data?.message) {
        setErrorMessage(e.data.message);
        return;
      }
      if (e.data?.reason) {
        setErrorMessage(e.reason);
        return;
      }
      if (e.reason) {
        setErrorMessage(e.reason);
        return;
      }

      // Generic error
      setErrorMessage('Error interacting with the smart contract');
    }
  };

  const renderSwitch = (fileType: string) => {
    switch (fileType) {
      case 'video/ogg':
      case 'video/mp4':
        return (
          <ReactPlayer
            className="ReactPlayerInput"
            width="100%"
            controls
            height="100%"
            url={mediaSrc}
          />
        );
      case 'audio/mp3':
      case 'audio/mpeg':
        return <ReactAudioPlayer src={mediaSrc} controls />;
      default:
        return <img src={urlPreviewFile} className="object-contain" alt="file-preview" />;
    }
  };

  return (
    <form className="mint-form" onSubmit={e => e.preventDefault()}>
      <Navbar />
      <div className="flex flex-col md:flex-row gap-20 justify-center">
        {file && (
          <div className="my-2 flex w-full items-center justify-center md:justify-end">
            <div className="upload-preview">{renderSwitch(file.type)}</div>
          </div>
        )}

        <div className="my-2 flex flex-col w-full">
          <input
            required
            type="file"
            id="inputFile"
            name="inputFile"
            className="hidden"
            accept=".png, .jpg, .jpeg, .svg, .gif, .mp3, .wav, .ogg, .mp4, ."
            onChange={e => fileHandleChange(e)}
          />
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="title" className="w-100">
              Title
              <input
                required
                type="text"
                name="title"
                onChange={e => setTitle(e.target.value)}
                className="form-control"
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="description" className="w-100">
              Description
              <textarea
                required
                maxLength={2490}
                name="description"
                onChange={e => setDescription(e.target.value)}
                className="form-control"
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="prop1" className="w-100">
              Prop 1:
              <input
                type="text"
                name="prop1"
                value={propOne}
                className="form-control"
                onChange={e => setPropOne(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="prop2" className="w-100">
              Prop 2:
              <input
                type="text"
                name="prop2"
                value={propTwo}
                className="form-control"
                onChange={e => setPropTwo(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="prop3" className="w-100">
              Prop 3:
              <input
                type="text"
                name="prop3"
                value={propThree}
                className="form-control"
                onChange={e => setPropThree(e.target.value)}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="inputDuration" className="w-100">
              Duration
              <input
                id="inputDuration"
                name="inputDuration"
                required
                className="form-control"
                type="number"
                placeholder="duration (in minutes)"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <label htmlFor="selectToken" className="w-100">
              Token
              <select
                required
                id="selectToken"
                name="selectToken"
                className="form-control"
                value={token}
                onChange={e => setToken(e.target.value)}
              >
                <option disabled selected>
                  Select a token
                </option>
                <option value={process.env.NEXT_PUBLIC_CBRL}>pBRL</option>
                <option value={process.env.NEXT_PUBLIC_CUSD}>pUSD</option>
                <option value={process.env.NEXT_PUBLIC_CEUR}>pEUR</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mt-2">
          <Button
            extraClass="primary-full"
            type="submit"
            onClick={() => processValues()}
            text="Send"
          />
          <span className="text-danger">{errorMessage}</span>
        </div>
      </div>
    </form>
  );
};

export default MintForm;
