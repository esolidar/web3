import { useRouter } from 'next/router'
import truncateAddress from '../../utils/truncateAddress'
import { useContractKit } from '@celo-tools/use-contractkit'
import { ethers } from 'ethers'
import { Card, ListGroup, ListGroupItem, Table } from 'react-bootstrap'

//ABI
import Sweepstake from '../../abi/EsolidarSweepstake.json'
import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json'
import { useEffect, useState } from 'react'
import Navbar from '../../components/sweepstake/Navbar'


export default function searchTokenByID(context){

    const { query } = useRouter()

    const { 
      performActions,
      address,
      network,
      account,        
      kit,
      initialised        
    } = useContractKit();

    const contractSweepstake = new kit.web3.eth.Contract(Sweepstake, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)

    const [currentNft, setCurrentNft] = useState(0)  
  
    async function getNftDetails(){
      const nftDetails = await contractSweepstake.methods.getSweepstakeWithDonors(query.id).call()
      setCurrentNft(nftDetails)
    }

    useEffect(() => {
      if(query.id != null || query.id != undefined){
        getNftDetails()
      }
    },[query.id])


    return (
        <div className='d-flex flex-column align-items-center justify-content-center'>
          <div>
            <Navbar/>
          </div>
          <div>            
            <h1>Token Details</h1>
          </div>

          <div className='d-flex flex-column'>
          <Card style={{ width: '18rem' }}>            
            <Card.Body>
              <Card.Title>NFT ID: {currentNft[0]}</Card.Title>
              <Card.Text>
                Owner: {currentNft[2]}
              </Card.Text>
              <Card.Text>
                Token: {currentNft[3]}
              </Card.Text>
            </Card.Body>
            <ListGroup className="list-group-flush">
              <ListGroupItem>Duration: {currentNft[4]}</ListGroupItem>
              <ListGroupItem>Total Staked: {currentNft[5]}</ListGroupItem>
              <ListGroupItem>Winner: {currentNft[6]}</ListGroupItem>
              <ListGroupItem>DrawTimeStamp: {currentNft[7]}</ListGroupItem>
              <ListGroupItem>Active: {currentNft[9] == true ? 'Active' : 'Deactive'}</ListGroupItem>
              <ListGroupItem>Destroyed: {currentNft[10] == true ? 'Destroyed' : 'Not Destroyed'}</ListGroupItem>
              <ListGroupItem>Metadado: {currentNft[1]}</ListGroupItem>
            </ListGroup>
          </Card>
          </div>

          <Table striped bordered hover>
            <thead>
              <tr>      
                <th>Address:</th>
                <th>Value staked:</th>      
              </tr>
            </thead>
            <tbody>
              { currentNft[8]?.map((donor) => {                
                return (
                  <tr>      
                    <td>{donor[0]}</td>
                    <td>{ethers.utils.formatEther(donor[1])}</td>      
                  </tr>
                )
              })}

            </tbody>
          </Table>
        </div>         
    )
}