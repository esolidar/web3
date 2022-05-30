import { Nav } from "react-bootstrap";

import ERC721EsolidarSweepstake from '../../abi/ERC721EsolidarSweepstake.json'
import Sweepstake from '../../abi/EsolidarSweepstake.json'
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
    const [haveDonation, setHaveDonation] = useState(false);
    const [allMint, setAllMint] = useState([]);

    const contractSweepstake = new kit.web3.eth.Contract(Sweepstake, process.env.NEXT_PUBLIC_ESOLIDAR_SWEEPSTAKE)
    const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(ERC721EsolidarSweepstake, process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE)

    const arrayColumn = (array, column) => {
        return array.map(item => item[column]);
      }
    
    async function getRoles(){

            console.log('START', address)
            setHaveDonation(false)
            setIsAdmin(false)
            setIsCharity(false)

            let allMint = []

            await performActions(async (kit) => {                  
                
                const res = await contractSweepstake.methods.getAllSweepstakes().call()
                let accounts = arrayColumn(res, 7)      
                accounts.find((user) => {
                    if(user[0] == undefined) return                
                    allMint.push(user[0][0])                    
                })
                console.log('MIDDLE', address)
                
                const MINTER = await contractERC721EsolidarSweepstake.methods.hasRole(process.env.NEXT_PUBLIC_PREXIS_MINTER_ROLE, address).call()
                const ADMIN = await contractERC721EsolidarSweepstake.methods.hasRole(process.env.NEXT_PUBLIC_PREXIS_ADMIN_ROLE, address).call()
                setIsAdmin(ADMIN)
                setIsCharity(MINTER)
                console.log(allMint.includes(address))
                if(allMint.includes(address)){
                    setHaveDonation(true)
                    console.log('have donation')
                }
            })
                console.log('END', address)

    }

    async function userHaveDonations(){
        let allMint = []
        await performActions(async (kit) => {            
            const res = await contractSweepstake.methods.getAllSweepstakes().call()
            let accounts = arrayColumn(res, 7)      
            accounts.find((user) => {
                if(user[0] == undefined) return                
                allMint.push(user[0][0])
                if(user[0][0] == address) setHaveDonation(true)
            })
            setAllMint(allMint)
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
                      
            <Nav.Item as="li">
                <Nav.Link href="/sweepstake/mydonations" eventKey="link-2">My Donations</Nav.Link>
            </Nav.Item>            

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