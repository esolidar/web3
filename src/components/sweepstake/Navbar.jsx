import { Nav } from "react-bootstrap";
import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json'
import { useContractKit } from '@celo-tools/use-contractkit'
import { useEffect, useState } from "react";

export default function Navbar(){

    const { 
        performActions,
        address,
        account,
        kit
        } = useContractKit();

    const [isAdmin, setIsAdmin] = useState(false);
    const [isCharity, setIsCharity] = useState(false);

    const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

    async function getRoles(){
            setIsAdmin(false)
            setIsCharity(false)

            await performActions(async (kit) => {                  
                const MINTER = await contractERC721EsolidarSweepstake.methods.hasRole(process.env.NEXT_PUBLIC_MINTER_ROLE, address).call()
                const ADMIN = await contractERC721EsolidarSweepstake.methods.hasRole(process.env.NEXT_PUBLIC_ADMIN_ROLE, address).call()
                setIsAdmin(ADMIN)
                setIsCharity(MINTER)
            })
    }

    useEffect(() => {
        if(address != null){
            getRoles()
        }
    },[address])

    return (
        <Nav defaultActiveKey="/home" as="ul">
            <Nav.Item as="li">
                <Nav.Link href="/sweepstake" eventKey="link-1">Home</Nav.Link>
            </Nav.Item>

            { address != null && isCharity ?
                <Nav.Item as="li">
                    <Nav.Link href="/sweepstake/mysweepstakes" eventKey="link-1">My Sweepstakes</Nav.Link>
                </Nav.Item>
                :
                null
            }
            { address != null ?
                <Nav.Item as="li">
                    <Nav.Link href="/sweepstake/mydonations" eventKey="link-2">My Donations</Nav.Link>
                </Nav.Item>            
            :
            null
            }        

            { address != null && isAdmin ? 
                <Nav.Item as="li">
                    <Nav.Link href="/sweepstake/rolemanager" eventKey="link-2">Role Manager</Nav.Link>
                </Nav.Item>
                :
                null
            }

        </Nav>
    )
}