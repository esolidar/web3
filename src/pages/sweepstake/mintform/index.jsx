import React, { useState } from 'react'
import axios from 'axios'

import ReactPlayer from "react-player"
import ReactAudioPlayer from 'react-audio-player'

import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json'
import { sweetAlertError, sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert'
import { useContractKit } from '@celo-tools/use-contractkit'
import Navbar from '../../../components/sweepstake/Navbar'

export default function MintForm() {

  const { 
    performActions,
    address,
    network,
    account,        
    kit,
    initialised        
  } = useContractKit()

  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

  const [file, setFile] = useState()
  const [mediaSrc, setMediaSrc] = useState("")
  const [urlPreviewFile, setUrlPreviewFile] = useState("")
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [propOne, setPropOne] = useState()
  const [propTwo, setPropTwo] = useState()
  const [propThree, setPropThree] = useState()
  const [duration, setDuration] = useState()
  const [token, setToken] = useState()
  const [errorMessage, setErrorMessage] = useState()

  function fileHandleChange(event) {

    // Verify if the user cancel the file
    if (event.target.files[0] == undefined || event.target.files[0] == null) return;

    const viewFileTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "video/mp4",
      "video/ogg",
      "audio/mp3",
      "audio/mpeg"
    ];


    if (event.target.value.includes(viewFileTypes[0] || viewFileTypes[1] || viewFileTypes[2] || viewFileTypes[3] || viewFileTypes[4] || viewFileTypes[5])) {
      return;
    }

    if (event.target.files[0].size / (1024 * 1024) > 50) {
      setTextImage("File cannot be greater than 50MB")
      return
    }

    if (["image/jpeg", "image/png", "image/gif", "image/svg+xml"].includes(event?.target.files[0].type)) {
      setUrlPreviewFile(URL.createObjectURL(event.target.files[0]));
    }

    if (["audio/mp3", "audio/mpeg", "video/mp4", "video/ogg"].includes(event?.target.files[0].type)) {
      setMediaSrc(URL.createObjectURL(event.target.files[0]))
    }

    // Save file states
    setFile(event.target.files[0]);
  }

  const processValues = async () => {

    const MINTER = await contractERC721EsolidarSweepstake.methods.hasRole(process.env.NEXT_PUBLIC_MINTER_ROLE, address).call()
    if(MINTER == false){
      setErrorMessage("You must be a charity to perform this action")
      return
    }

    setErrorMessage('')

    try {
      const attributes = [
        { trait_type: 'prop1', value: propOne },
        { trait_type: 'prop2', value: propTwo },
        { trait_type: 'prop3', value: propThree },
      ]

      // Send file to IPFS
      const formDataFile = new FormData()
      formDataFile.append("file", file)

      var formData = new FormData();
      formData.append("file", file);

      try {
        const resp = await axios.post('/api/ipfs', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        var respFile = resp.data
      } catch (e) {
        console.log(e)
      }

      // Generate metadata json
      const metadataJson = {
        'image': `ipfs://${respFile.ipfs}`,
        'external_url': process.env.NEXT_PUBLIC_S3_URL + respFile.filename,
        'name': title,
        'description': description,
        'attributes': attributes
      }

      formData = new FormData()
      formData.append("metadata", JSON.stringify(metadataJson))

      // Mint tokenURI respMetadado
      await performActions(async (kit) => {
        const resp = await axios.post('/api/ipfs', formData)
        const tokenUri = resp.data.tokenUri

        let gasLimit = await contractERC721EsolidarSweepstake.methods
          .mint(tokenUri, token, duration * 60)
          .estimateGas()
        
        let res = await contractERC721EsolidarSweepstake.methods
          .mint(tokenUri, token, duration * 60)
          .send({ from: address, gasLimit })

        sweetAlertSuccess('Your campaign was created successfully!')

        setTimeout(() => {
          window.location.href = `/sweepstake/${res.events.Transfer.returnValues.tokenId}`
        }, 2000)
      })

    } catch (e) {
      
      // If Generic error
      if(e.message == 'Internal JSON-RPC error.'){
        setErrorMessage('Error interacting with the smart contract')
      }

      if(e.message){
        setErrorMessage(e.message)
        return
      }
      if(e.data?.message){
        setErrorMessage(e.data.message)
        return
      }
      if(e.data?.reason){
        setErrorMessage(e.reason)
        return
      }
      if(e.reason){
        setErrorMessage(e.reason)
        return
      }

      // Generic error
      setErrorMessage('Error interacting with the smart contract')
    }
  }

  return (

    <form className="mint-form" onSubmit={e => e.preventDefault()}>
      <Navbar/>
      <div className="flex flex-col md:flex-row gap-20 justify-center">
        <div>
          {/* ===> FILE  */}
          {/* ===> PREVIEW FILE  */}
          <div className="mb-5 flex w-full items-center justify-center md:justify-end">
            {file && (
              <div className="upload-preview">
                {file.type == 'video/mp4' || file.type == 'video/ogg' ? (
                  <ReactPlayer className="ReactPlayerInput" width="100%" controls height="100%" url={mediaSrc} />
                ) : file.type == 'audio/mp3' || file.type == 'audio/mpeg' ? (
                  <ReactAudioPlayer src={mediaSrc} controls />
                ) : (
                  <img src={urlPreviewFile} className="object-contain" />
                )}
              </div>
            )}
          </div>

          <div className="mb-5 flex flex-col w-full">
            <input
              required
              type="file"
              id="inputFile"
              name="inputFile"
              className="hidden"
              accept=".png, .jpg, .jpeg, .svg, .gif, .mp3, .wav, .ogg, .mp4, ."
              onChange={(e) => fileHandleChange(e)}
            />
          </div>
        </div>

        <div>

          {/* ===> TITLE */}
          <div className="">
            <input required type="text" name="title" onChange={e => setTitle(e.target.value)} className="form-control" />
            <label htmlFor="title">Title</label>
          </div>

          {/* ===> DESCRIPTION */}
          <div className="">
            <textarea required maxLength="2490" name="description" onChange={e => setDescription(e.target.value)} className="form-control"></textarea>
            <label htmlFor="name">
              Description
            </label>
          </div>

          {/* ===> PROPERTIES */}
          {/* Prop 1 */}
          <div>
            <input type="text" value={propOne} className="form-control" onChange={e => setPropOne(e.target.value)} />
            <label>Prop 1:</label>
          </div>

          {/* Prop 2 */}
          <div>
            <input type="text" value={propTwo} className="form-control" onChange={e => setPropTwo(e.target.value)} />
            <label>Prop 2:</label>
          </div>

          {/* Prop 3 */}
          <div>
            <input type="text" value={propThree} className="form-control" onChange={e => setPropThree(e.target.value)} />
            <label>Prop 3:</label>
          </div>

          {/* Duration */}
          <div>
            <input id="inputDuration" required class="form-control" type="number" placeholder="duration (in minutes)" value={duration} onChange={e => setDuration(e.target.value)} />
            <label htmlFor="inputDuration">Duration</label>
          </div>

          {/* Token */}
          <div>
            <select required id="selectToken" class="form-control" value={token} onChange={e => setToken(e.target.value)}> 
              <option disabled selected>Select a token</option> 
              <option value={process.env.NEXT_PUBLIC_CBRL}>pBRL</option> 
              <option value={process.env.NEXT_PUBLIC_CUSD}>pUSD</option> 
              <option value={process.env.NEXT_PUBLIC_CEUR}>pEUR</option> 
            </select> 
          </div>


          <div className="mt-2">
            <button
              onClick={e => processValues()}
              type="submit"
              className="btn-esolidar btn-primary-full btn-lg client__primary--background-color client__primary--border-color client__primary--background-color-hover client__primary--border-color-hover"
            >
              <>Send</>
            </button>
            <span className="text-danger">
              {errorMessage}
            </span>
          </div>

        </div>
      </div>

    </form>
  )
}