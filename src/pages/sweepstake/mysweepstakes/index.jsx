import { useContractKit } from '@celo-tools/use-contractkit'
import { ethers } from 'ethers'
import truncateAddress from '../../../utils/truncateAddress'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import NumberFormat from 'react-number-format';
import Navbar from '../../../components/sweepstake/Navbar'

// ABIs
import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json'
import Sweepstake from '../../../abi/EsolidarSweepstake.json'

// Sweetalert
import { sweetAlertError, sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert'
import Swal from 'sweetalert2'

export default function MySweepstakes(){

    const buttonStyle = {border: '1px solid cyan', borderRadius: '4px', padding: '5px'}

    const { 
        performActions,
        address,
        network,
        account,        
        kit,
        initialised        
    } = useContractKit();

    const [showActive, setShowActive] = useState(true);
    const [showCompleted, setShowCompleted] = useState(false);
    const [showCanceled, setShowCanceled] = useState(false);
    const [tokensToWithDraw, setTokensToWithDraw] = useState([])
    const [allSweepstakes, setAllSweepstakes] = useState([])

    function renderCampaings(campaing){
        if(campaing == 'active'){
            setShowActive(true)
            setShowCompleted(false)
            setShowCanceled(false)
        }
        if(campaing == 'completed'){
            setShowCompleted(true)
            setShowActive(false)
            setShowCanceled(false)
        }
        if(campaing == 'canceled'){
            setShowCanceled(true)
            setShowActive(false)
            setShowCompleted(false)
        }
    }
    
    useEffect(() => {      
            getAllSweepstakesContract()                         
    },[account])

    const contractSweepstake = new kit.web3.eth.Contract(Sweepstake, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)
    const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

    async function getAllSweepstakesContract(){        
        try{
          await performActions(async (kit) => {        
            const res = await contractSweepstake.methods.getAllSweepstakes().call();
            setAllSweepstakes(res)
           
            // Get tokens of all sweepstakes
            let sweepstakesArray = []        
            for(const sweepstakeResult of res){      
                if(sweepstakeResult[9] == false && sweepstakeResult[10] == false){     
                    if(sweepstakesArray.includes(sweepstakeResult[3])) continue
                    sweepstakesArray.push(sweepstakeResult[3])
                } 
            }
    
            // Get balanceOf() of user in all tokens sweepstakes
            let balanceOfTokens = []
            for(const sweepstakeToken of sweepstakesArray){                
                const balance = await contractSweepstake.methods.balanceOf(address, sweepstakeToken).call();
                if(ethers.utils.formatEther(balance) > 0){
                    balanceOfTokens.push([sweepstakeToken, balance])
                }
            }
            setTokensToWithDraw(balanceOfTokens)
          })
        }catch(e){
            console.log(e)
        }          
    }

    async function createCampaing(){

        await Swal.fire({
            title: 'Create a new campaign',
            showCancelButton: true,
            html:
            '<div class="d-flex flex-column">' +
                '<select id="selectToken" class="my-1 py-2">' +
                    '<option disabled selected>Select a token</option>' +
                    '<option>pBRL</option>' +
                    '<option>pUSD</option>' +
                    '<option>pEUR</option>' +
                '</select>' +
                `<input id="inputTokenURI" required class="my-1 py-2" type="text" placeholder="token URI"/>` +                
                '<input id="inputDuration" required class="my-1 py-2" type="text" placeholder="duration (in minutes)" />' +            
            '</div>'
            ,              
            focusConfirm: false,
            preConfirm: async () => {

                try{
                    let token = document.getElementById('selectToken').value
                    let inputTokenURI = document.getElementById('inputTokenURI').value
                    let duration = Number(document.getElementById('inputDuration').value)
                    
                    token == 'pBRL' ? token = process.env.NEXT_PUBLIC_CBRL :
                    token == 'pUSD' ? token = process.env.NEXT_PUBLIC_CUSD :
                    token == 'pEUR' ? token = process.env.NEXT_PUBLIC_CEUR :
                    null                        
                    
                    if(token == null) return 

                    await performActions(async (kit) => {
                        
                        Swal.close()

                        let gasLimit = await contractERC721EsolidarSweepstake.methods
                        .mint(inputTokenURI, token, duration * 60)
                        .estimateGas()    

                        await contractERC721EsolidarSweepstake.methods
                        .mint(inputTokenURI, token, duration * 60)
                        .send({ from: address, gasLimit })
                        
                        sweetAlertSuccess('Your campaign was created successfully!')

                        getAllSweepstakesContract()
                      })
                                    
                }catch(e){
                    if(e?.reason?.includes('0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6')){
                        sweetAlertError('You need to be a Charity to create a campaing')
                    }           
                }
            }
          })
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

    async function cancelCampaing(nftID){
        try{
            await performActions(async (kit) => {
      
              let gasLimit = await contractERC721EsolidarSweepstake.methods
              .burn(nftID)
              .estimateGas()
              
              let res = await contractERC721EsolidarSweepstake.methods
              .burn(nftID)
              .send({ from: address, gasLimit })
      
              if(res.status == true){
                sweetAlertSuccess('Your campaign was canceled successfully!')
                getAllSweepstakesContract()
              }else{
                sweetAlertError('Your campaign was not canceled!')
                getAllSweepstakesContract()
              }
              
            })
        }catch(e){
            console.log(e)
        }
    }

    async function draw(nftID){

        try{
            await performActions(async (kit) => {
              let gasLimit = await contractSweepstake.methods
              .draw(Number(nftID))
              .estimateGas()
              
              let res = await contractSweepstake.methods
              .draw(Number(nftID))
              .send({ from: address, gasLimit })
              
              if(res.status == true){
                sweetAlertSuccess('Success')
                getAllSweepstakesContract()
              }else{
                sweetAlertError('Error')
                getAllSweepstakesContract()
              }
            })
        }catch(e){
            console.log(e)
        }
    }

    async function withdraw(erc20){
        try{
            await performActions(async (kit) => {
                let gasLimit = await contractSweepstake.methods
                .withdraw(erc20)
                .estimateGas()    
                
                await contractSweepstake.methods
                .withdraw(erc20)
                .send({ from: address, gasLimit })
                
                sweetAlertSuccess('Success', 'Your withdraw was successful!')
                getAllSweepstakesContract()
            })
        }catch(e){
            console.log(e)
        }
    }

    function card(
        nftID,
        nftTokenURI,
        nftOwner,
        nftErc20token,
        nftDuration,
        nftTotalStaked,
        nftWinner,
        nftDrawTimestamp,
        nftActive,
        nftDestroyed,
    ){
        return (
            <div className="card my-3">
                <div className="card-body">
                    <h2 className="card-title">NFT ID: {nftID}</h2>
                    <div>
                        <span className="font-bold mr-3">Owner:</span> {nftOwner}</div>
                    <div>
                        <span className="font-bold mr-3">Token:</span>
                        {
                        nftErc20token == process.env.NEXT_PUBLIC_CBRL ? `${nftErc20token} (pBRL)` :
                        nftErc20token == process.env.NEXT_PUBLIC_CUSD ? `${nftErc20token} (pUSD)` :
                        nftErc20token == process.env.NEXT_PUBLIC_CEUR ? `${nftErc20token} (pEUR)` :
                        null
                        }
                    </div>                    
                    <div>
                        <span className="font-bold mr-3">Duration:</span>
                        {CountdownTimer(nftDuration * 1000)}                
                    </div>                    
                    <div>
                        <span className="font-bold mr-3">Total Staked:</span>
                        {nftTotalStaked}
                    </div>
                    <div>
                        <span className="font-bold mr-3">Metadata: {nftTokenURI}</span>
                    </div>
                    <div>
                        <span className="font-bold mr-3">Winner:</span>
                        {nftWinner}
                    </div>
                    <div>
                        <span className="font-bold mr-3">DrawTimeStamp:</span>
                        {nftDrawTimestamp}
                    </div>
                    <div>
                        <span className="font-bold mr-3">Active:</span>
                        {nftActive}
                    </div>
                    <div>
                        <span className="font-bold mr-3">Destroyed:</span>
                        {nftDestroyed}
                    </div>      
                    <div>
                        { nftActive == 'Active' ? <button className='mr-2 mt-2' onClick={() => draw(nftID)}>DRAW</button> : null }
                        { (nftDestroyed == 'Not destroyed') && (nftActive == 'Active') ? <button className='mr-2 mt-2' onClick={() => cancelCampaing(nftID)}>CANCEL</button> : null }                        
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            {/* Navbar */}
            <div>
                <Navbar/>
            </div>

            {/* Withdraw button */}            
                { tokensToWithDraw?.map((token, index) => {          
                    return (
                        <button className='d-flex flex-column align-items-center rounded-4' style={buttonStyle} onClick={() => withdraw(token[0])}>
                            <span>Claim {
                                token[0] == process.env.NEXT_PUBLIC_CBRL ? 'pBRL' :
                                token[0] == process.env.NEXT_PUBLIC_CUSD ? 'pUSD' :
                                token[0] == process.env.NEXT_PUBLIC_CEUR ? 'pEUR' :
                                truncateAddress(token[0],5)
                            }</span>

                            <NumberFormat 
                                value={ethers.utils.formatEther(token[1])} 
                                displayType={'text'} 
                                thousandSeparator={true} 
                                decimalScale={4} />  
                            </button>
                    )                   
                })}            
          
            {/* Create Campaing button */}
                <div style={{display: 'flex', justifyContent: 'space-around', marginRight: '25px', marginBottom: '50px'}}>
                    <button style={buttonStyle} onClick={() => createCampaing()}>Create Campaing</button>
                </div>

            {/* Switch buttons */}
                <div className="flex justify-around mt-10">
                    <button className="border mx-1" onClick={() => renderCampaings('active')}>Active</button>
                    <button className="border mx-1" onClick={() => renderCampaings('completed')}>Completed</button>
                    <button className="border mx-1" onClick={() => renderCampaings('canceled')}>Cancelled</button>
                </div>            
            
            {/* Actives */}            
                { allSweepstakes && showActive && allSweepstakes.map((sweepstake, index) => {
                    if(sweepstake[2] != address) return
                    if(sweepstake[9] != true) return
                    if(sweepstake[10] != false) return

                    return card(                        
                        sweepstake[0],
                        sweepstake[1],
                        sweepstake[2],
                        sweepstake[3],
                        sweepstake[4],
                        ethers.utils.formatEther(sweepstake[5]),
                        sweepstake[6],
                        sweepstake[7],
                        sweepstake[9] == true ? 'Active' : 'Inactive',
                        sweepstake[10] == true ? 'Destoyed' : 'Not destroyed', 
                    )
                })}

            {/* Completed */}            
                { allSweepstakes && showCompleted && allSweepstakes.map((sweepstake, index) => {
                    if(sweepstake[2] != address) return
                    if(sweepstake[10] != false) return
                    if(sweepstake[9] != false) return      

                    return card(                        
                        sweepstake[0],
                        sweepstake[1],
                        sweepstake[2],
                        sweepstake[3],
                        sweepstake[4],
                        ethers.utils.formatEther(sweepstake[5]),
                        sweepstake[6],
                        sweepstake[7],
                        sweepstake[9] == true ? 'Active' : 'Inactive',
                        sweepstake[10] == true ? 'Destoyed' : 'Not destroyed', 
                    )
                })}

            {/* Canceled */}            
                { allSweepstakes && showCanceled && allSweepstakes.map((sweepstake, index) => {
                    if(sweepstake[2] != address) return
                    if(sweepstake[9] != false) return
                    if(sweepstake[10] != true) return
                    
                    return card(
                        sweepstake[0],
                        sweepstake[1],
                        sweepstake[2],
                        sweepstake[3],
                        sweepstake[4],
                        ethers.utils.formatEther(sweepstake[5]),
                        sweepstake[6],
                        sweepstake[7],
                        sweepstake[9] == true ? 'Active' : 'Inactive',
                        sweepstake[10] == true ? 'Destoyed' : 'Not destroyed', 
                    )
                })}   
            
        </div>
    )
}