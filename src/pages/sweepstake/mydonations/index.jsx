import { useContractKit } from '@celo-tools/use-contractkit'
import { ethers } from 'ethers'
import truncateAddress from '../../../utils/truncateAddress'
import { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import Navbar from "../../../components/sweepstake/Navbar"

// ABIs
import Sweepstake from '../../../abi/EsolidarSweepstake.json'
import NumberFormat from 'react-number-format'

// SweetAlert
import { sweetAlertSuccess, sweetAlertError } from '../../../utils/sweepstake/sweetalert'

export default function MyDonors(){

    const buttonStyle = {border: '1px solid cyan', borderRadius: '4px', padding: '5px'}

    const { 
        performActions,
        address,
        kit
    } = useContractKit();

    const contractSweepstake = new kit.web3.eth.Contract(Sweepstake, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)

    const [allSweepstakes, setAllSweepstakes] = useState([])
    const [tokensToWithDraw, setTokensToWithDraw] = useState([])

    const [showActiveCampaings, setShowActiveCampaings] = useState(true)
    const [showCompletedCampaings, setShowCompletedCampaings] = useState(false)
    const [showWinsCampaings, setShowWinsCampaings] = useState(false)
    const [showCanceledCampaings, setShowCanceledCampaings] = useState(false)

    const [haveActiveTokens, setHaveActiveTokens] = useState(true)
    const [haveCompletedTokens, setHaveCompletedTokens] = useState(true)
    const [haveWinsTokens, setHaveWinsTokens] = useState(true)
    const [haveCanceledTokens, setHaveCanceledTokens] = useState(true)

    useEffect(() => {
        if(address != undefined){     
            getAllSweepstakesContract()            
        }
    },[address])

    const arrayColumn = (array, column) => {
        return array.map(item => item[column]);
    }

    async function getAllSweepstakesContract(){       
        console.log('Executando') 
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

    function renderCampaings(campaing){
        if(campaing == 'active'){
            setShowActiveCampaings(true)
            setShowCompletedCampaings(false)            
            setShowCanceledCampaings(false)
            setShowWinsCampaings(false)
        }
        if(campaing == 'completed'){
            setShowCompletedCampaings(true)            
            setShowActiveCampaings(false)
            setShowCanceledCampaings(false)
            setShowWinsCampaings(false)
        }
        if(campaing == 'wins'){
            setShowWinsCampaings(true)
            setShowActiveCampaings(false)
            setShowCompletedCampaings(false)            
            setShowCanceledCampaings(false)
        }
        if(campaing == 'canceled'){
            setShowCanceledCampaings(true)
            setShowActiveCampaings(false)
            setShowCompletedCampaings(false)            
            setShowWinsCampaings(false)
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
        nftDestroyed
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
                    { false == true ?
                    <div>
                        <span className="font-bold mr-3">Duration:</span>
                        {Countdown(nftDuration * 1000)}                
                    </div>
                    :
                    null
                    }
                    <div>
                        <span className="font-bold mr-3">Total Staked:</span>
                        {nftTotalStaked}
                    </div>
                    <div>
                        <span className="font-bold mr-3">Metadado: {nftTokenURI}</span>
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
                </div>
            </div>
        )
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

    return (        
        <div>        
                <div>
                    <Navbar/>
                    <button onClick={() => getAllSweepstakesContract()}>getAllSweepstakes</button>
                    <button onClick={() => console.log(allSweepstakes)}>AllSweepstakes</button>
                </div>
                <div className="flex justify-center my-2">
                    <h1 className="text-3xl">My Donations</h1>
                </div>
                <div className="flex flex-col flex-wrap justify-around">

                    <div className="flex justify-around">                    
                        { tokensToWithDraw?.map((token,id) => {
                            return (
                                <button className='d-flex flex-column align-items-center' style={buttonStyle} onClick={() => withdraw(token[0])}>
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
                    </div>    

                    <div className="flex justify-around mt-10">
                        <button className="btn btn-outline btn-sm" onClick={() => renderCampaings('active')}>Active</button>
                        <button className="btn btn-outline btn-sm" onClick={() => renderCampaings('completed')}>Completed</button>
                        <button className="btn btn-outline btn-sm" onClick={() => renderCampaings('wins')}>My Wins</button>
                        <button className="btn btn-outline btn-sm" onClick={() => renderCampaings('canceled')}>Cancelled</button>
                    </div>

                </div>

                {/* Active */}
                {showActiveCampaings && <div>
                { haveActiveTokens ? 
                    <div>
                        { address && allSweepstakes?.map((token) => {
                            if(token[8].length < 1) return
                            if(!arrayColumn(token[8], 0).includes(address)){
                                setHaveActiveTokens(false)
                                return
                            }
                            if(token[9] != true) return
                            if(token[10] != false) return
                            
                            return card(
                                token[0],
                                token[1],
                                token[2],
                                token[3],
                                token[4],
                                ethers.utils.formatEther(token[5]),
                                token[6],
                                token[7],
                                token[9] == true ? 'Active' : 'Inactive',
                                token[10] == true ? 'Destoyed' : 'Not destroyed',                        
                                )  
                            })}
                    </div>
                    :
                    <h1>You don't have active tokens</h1>}
                </div>}

                {/* Completed */}
                {showCompletedCampaings && <div>
                { haveCompletedTokens ?
                    <div>
                        { address && allSweepstakes?.map((token) => {
                            if(token[8].length < 1) return
                            if(token[10] != false) return
                            if(token[9] != false) return
                            if(!arrayColumn(token[8], 0).includes(address)){
                                setHaveCompletedTokens(false)
                                return
                            }

                            return card(
                                token[0],
                                token[1],
                                token[2],
                                token[3],
                                token[4],
                                ethers.utils.formatEther(token[5]),
                                token[6],
                                token[7],
                                token[9] == true ? 'Active' : 'Inactive',
                                token[10] == true ? 'Destoyed' : 'Not destroyed',                        
                            )
                        })}
                    </div>
                    :
                    <h1>You don't have completed tokens</h1>}
                </div>}

                {/* My wins */}
                {showWinsCampaings && <div>    
                { haveWinsTokens ?  
                    <div>             
                    { address && allSweepstakes?.map((token) => {  

                        if(token[8].length < 1) return
                        if(token[9] != false) return
                        if(token[10] != false) return
                        if(token[6] != address){
                            setHaveWinsTokens(false)
                            return
                        }
                        
                        return card(
                            token[0],
                            token[1],
                            token[2],
                            token[3],
                            token[4],
                            ethers.utils.formatEther(token[5]),
                            token[6],
                            token[7],
                            token[9] == true ? 'Active' : 'Inactive',
                            token[10] == true ? 'Destoyed' : 'Not destroyed',                        
                        )
                    })}
                    </div>
                    :
                    <h1>You don't have win tokens</h1>}
                </div>}

                {/* Cancelled */}
                {showCanceledCampaings && <div>  
                { haveCanceledTokens ?
                    <div>                  
                    { address && allSweepstakes?.map((token) => {  

                        if(token[8].length < 1) return
                        if(token[10] != true) return
                        if(token[9] != false) return
                        if(!arrayColumn(token[8], 0).includes(address)){
                            setHaveCanceledTokens(false)
                            return
                        }

                        return card(
                            token[0],
                            token[1],
                            token[2],
                            token[3],
                            token[4],
                            ethers.utils.formatEther(token[5]),
                            token[6],
                            token[7],
                            token[9] == true ? 'Active' : 'Inactive',
                            token[10] == true ? 'Destoyed' : 'Not destroyed',                        
                        )                                 
                    })}
                    </div>
                    :
                    <h1>You don't have canceled tokens</h1>}
                </div>}
                
        </div>        
    )
}