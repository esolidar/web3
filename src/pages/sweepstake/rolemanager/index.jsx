import { useContractKit } from '@celo-tools/use-contractkit'

// ABI
import ERC721EsolidarSweepstake from '../../../utils/sweepstake/sweetalert'

// Sweetalert
import { SwalQuestion, sweetAlertError, sweetAlertSuccess } from '../../../utils/sweetalert'
import Navbar from '../../../components/sweepstake/Navbar'

export default function roleManager(){

    const { 
        performActions,
        address,
        kit
        } = useContractKit();

    const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

    async function grantRole(e, role){
        e.preventDefault();

        console.log(e.target.address.value)

        try{

            let hasHole = await contractERC721EsolidarSweepstake.methods.hasRole(role, e.target.address.value).call()
            if(hasHole){
                sweetAlertError('User already has this role')
                return
            }

            await performActions(async (kit) => {        
              let gasLimit = await contractERC721EsolidarSweepstake.methods
              .grantRole(role,e.target.address.value)
              .estimateGas()
              
              await contractERC721EsolidarSweepstake.methods
              .grantRole(role,e.target.address.value)
              .send({ from: address, gasLimit })
              
              sweetAlertSuccess('Success', 'You have been granted the role')
            })
          }catch(e){
            sweetAlertError('Error', e.message)
          }
    }

    return (
        <div>
            <Navbar />
            <h1>Role Manager</h1>
            <div className="d-flex justify-content-center">

                <div className="d-flex flex-column justify-content-center align-items-center mx-3">
                    <h2>Add role admin</h2>
                    <form onSubmit={(e) => grantRole(e, process.env.NEXT_PUBLIC_ADMIN_ROLE)} className="d-flex flex-column">                    
                        <input type="text" name="address" placeholder="address"/>
                        <button>Add</button>
                    </form>
                </div>

                <div className="d-flex flex-column justify-content-center align-items-center mx-3">
                    <h2>Add role minter</h2>
                    <form onSubmit={(e) => grantRole(e, process.env.NEXT_PUBLIC_MINTER_ROLE)} className="d-flex flex-column">                    
                        <input type="text" name="address" placeholder="address"/>
                        <button>Add</button>
                    </form>
                </div>

            </div>
        </div>
    )
}