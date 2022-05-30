import { useContractKit } from '@celo-tools/use-contractkit'
import { Card } from 'react-bootstrap'
import { CeloProvider } from '@celo-tools/celo-ethers-wrapper'
import { ethers } from 'ethers'
import truncateAddress from '../../utils/truncateAddress'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown';

// ABIs
import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json'
import ERC20 from '../../abi/ERC20.json'
import Sweepstake from '../../abi/EsolidarSweepstake.json'

// Sweetalert
import Swal from 'sweetalert2'
import { SwalQuestion, sweetAlertError, sweetAlertSuccess } from '../../utils/sweepstake/sweetalert'
import Navbar from '../../components/sweepstake/Navbar'

export default function Home(){

  const { 
    performActions,
    address,
    kit
    } = useContractKit();

  useEffect(() => {
    getAllSweepstakesContract()
  },[address])

  const [allSweepstakes, setAllSweepstakes] = useState([])

  const contractSweepstake = new kit.web3.eth.Contract(Sweepstake, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)
  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

  async function getAllSweepstakesContract(){
    if(address != null){
    try{
      await performActions(async (kit) => {        
        const res = await contractSweepstake.methods.getAllSweepstakes().call();
        setAllSweepstakes(res)
      })
    }catch(e){
        console.log(e)
    }
    }else{
      const JsonRpcProvider = new CeloProvider(process.env.NEXT_PUBLIC_JSON_RPC_PROVIDER)
      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE, Sweepstake, JsonRpcProvider)        
      const res = await contract.getAllSweepstakes()      
      setAllSweepstakes(res)
    }

  }

  function CountdownTimer(date, renderer) {
    return (
      <>
        <Countdown
          autoStart={true}
          date={date}
          renderer={({ days, hours, minutes, seconds, completed }) => {
            if (completed) {
              return 'Completed'
            } else {              
                if(days > 1 && hours > 1){
                  return (
                <span>
                  {days}d {hours}h
                </span>
                  )
                }else{
                  return (
                    <span className="">
                      {minutes}m {seconds}s
                    </span>
                  )
                }              
            }
          }}
          />
      </>
  )};

  async function StakeNFT(nftID, amount){    
    try{
      await performActions(async (kit) => {

        let gasLimit = await contractSweepstake.methods
        .stake(nftID, ethers.utils.parseEther(amount))
        .estimateGas()
        
        let res = await contractSweepstake.methods
        .stake(nftID, ethers.utils.parseEther(amount))
        .send({ from: address, gasLimit })

        // Test to now if the "res.status" return the status success or error of transacion
        if(res.status == true){
          sweetAlertSuccess('Success', 'Stake on NFT ' + nftID + ' with amount ' + amount + ' was successful')
        }else{
          sweetAlertError('Error', 'Stake on NFT ' + nftID + ' with amount ' + amount + ' was not successful')
        }
        
        getAllSweepstakesContract()
      })
    }catch(e){
        console.log(e)
    }
  }

  async function beforeStake(nftID, token){
    const { value: amount } = await Swal.fire({
        title: token,
        input: 'text',
        inputLabel: 'Amount to stake',
        inputPlaceholder: '0.00',

        preConfirm: async (amount) => {   

            const contractERC20 = new kit.web3.eth.Contract(ERC20, 
              token == 'pEUR' ? process.env.NEXT_PUBLIC_PREXIS_TEST_EUR :
              token == 'pUSD' ? process.env.NEXT_PUBLIC_PREXIS_TEST_USD :
              token == 'pBRL' ? process.env.NEXT_PUBLIC_PREXIS_TEST_BRL :
              null
              )
            
            let amountOfToken;
            let amountOfAllowance;
            
            await performActions(async (kit) => {        
              const res = await contractERC20.methods.balanceOf(address).call();
              amountOfToken = ethers.utils.formatEther(res)
            })

            await performActions(async (kit) => {        
              const res = await contractERC20.methods.allowance(address, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE).call();
              amountOfAllowance = ethers.utils.formatEther(res)
            })
            
            amount = amount.replace(',','.')    
              
            if(amount.match(/[^0-9.]/g)){
                sweetAlertError("Error", "Please enter a valid amount")
                return;
            }
            if(amount.match(/[a-z]/i)){
                sweetAlertError("Error", "Please enter a valid amount")
                return;
            }

            try{
                if(Number(amount) > Number(amountOfToken)){
                    sweetAlertError("Insufficient Balance", "You need to have more balance to stake")
                    return
                }
                if(Number(amount) > Number(amountOfAllowance)){
                    addMoreAllowance(amount, contractERC20, amountOfAllowance, nftID) 
                    return
                }

                StakeNFT(nftID, amount)                    
            }catch(e){
                console.table(e)
            }
            
        }
      })
  }

  async function addMoreAllowance(amount, token, currentAllowance, nftID){
    
    let remaining = amount - currentAllowance

      try{
          let question = await SwalQuestion("Insufficient Allowance", `You need to add ${remaining} more allowance to continue. Do you want to add more?`)

          if(question == true){
              await performActions(async (kit) => {
        
                let gasLimit = await token.methods
                .increaseAllowance(process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE, ethers.utils.parseEther(remaining.toString()))
                .estimateGas()
                
                await token.methods
                .increaseAllowance(process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE, ethers.utils.parseEther(remaining.toString()))
                .send({ from: address, gasLimit })
                sweetAlertSuccess('Success', 'Allowance was added successfully')

                setTimeout(async () => {
                  let question = await SwalQuestion("Do you want to stake now?")
                  if(question == true){
                      StakeNFT(nftID, amount)
                  }
                }, 2000)
              })
          }else{
              return
          }
    
}catch(e){
    sweetAlertError("Error", "Something went wrong")
    console.log(e)
}
  }

  async function draw(nftID){
    try{
      await performActions(async (kit) => {        
        let gasLimit = await contractSweepstake.methods
        .draw(nftID)
        .estimateGas()
        
        await contractSweepstake.methods
        .draw(nftID)
        .send({ from: address, gasLimit })
        
        sweetAlertSuccess('Success', 'Draw was successful')
        getAllSweepstakesContract()
      })
    }catch(e){
      console.log(e)
    }
  }

  const buttonStyle = {
    backgroundColor: 'gray',
    color: 'white',
    width: '100%',
    borderRadius: '10px',
    padding: '10px',
    margin: '2px',
  }

    return (
        <div>            
            <div className='row'>
              <div>
                  <Navbar/>
              </div>
              <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <h1 style={{textAlign: 'center'}}>Active campaings</h1>
              </div>
                {allSweepstakes && allSweepstakes?.map((sweepstake, id) => {

                  if(sweepstake[8] !== true) return

                  return (
                    <div key={id} className='col-md-4 my-4'>
                      <Card style={{ width: '18rem', borderRadius: '10px' }}>
                        <Card.Body>
                          <Card.Title>NFT ID: {typeof sweepstake[0] == 'object' ? sweepstake[0].toNumber() : sweepstake[0]}</Card.Title>
                          <Card.Subtitle className="mb-2 text-muted">
                            { sweepstake[1] == address ?
                              <span>You are the owner</span>
                            :
                              <span>Owner: {truncateAddress(sweepstake[1], 5)}</span> 
                            }
                          </Card.Subtitle>
                          <Card.Text>Token: {
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_BRL ? 'pBRL' :
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_EUR ? 'pEUR' :
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_USD ? 'pUSD' :
                            truncateAddress(sweepstake[2], 5)
                          }</Card.Text>
                          <Card.Text>Total Staked: {ethers.utils.formatEther(sweepstake[4])}</Card.Text>
                          <Card.Text>Time: {CountdownTimer(typeof sweepstake[3] === 'object' ? sweepstake[3].toNumber() * 1000 : sweepstake[3] * 1000)}</Card.Text>
                          <button style={buttonStyle} 
                          onClick={() => beforeStake(
                            typeof sweepstake[0] == 'object' ? sweepstake[0].toNumber() : sweepstake[0],
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_BRL ? 'pBRL' :
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_EUR ? 'pEUR' :
                            sweepstake[2] === process.env.NEXT_PUBLIC_PREXIS_TEST_USD ? 'pUSD' :
                            truncateAddress(sweepstake[2], 5)
                            )}>STAKE
                          </button>
                          { sweepstake[1] == address ?
                            <button style={buttonStyle} onClick={() => draw(sweepstake[0])}>
                              DRAW
                            </button>
                            :
                            null
                          }
                        </Card.Body>
                        <div className='d-flex justify-content-center'>
                          <Card.Link href={`/sweepstake/${typeof sweepstake[0] == 'object' ? sweepstake[0].toNumber() : sweepstake[0]}`}>NFT Details</Card.Link>
                        </div>
                      </Card>
                    </div>
                  )
                })}   
            </div>         
        </div>
    )
}