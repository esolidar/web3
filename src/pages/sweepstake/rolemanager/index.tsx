import React from 'react';
import { useContractKit } from '@celo-tools/use-contractkit';
import ERC721EsolidarSweepstake from '../../../abi/ERC721EsolidarSweepstake.json';
import { sweetAlertError, sweetAlertSuccess } from '../../../utils/sweepstake/sweetalert';
import Navbar from '../../../components/sweepstake/Navbar';

const RoleManager = () => {
  const { performActions, address, kit } = useContractKit();

  const contractERC721EsolidarSweepstake = new kit.web3.eth.Contract(
    ERC721EsolidarSweepstake,
    process.env.NEXT_PUBLIC_ERC721_ESOLIDAR_SWEEPSTAKE
  );

  const grantRole = async (e: any, role: any) => {
    e.preventDefault();
    try {
      const hasHole = await contractERC721EsolidarSweepstake.methods
        .hasRole(role, e.target.address.value)
        .call();
      if (hasHole) {
        sweetAlertError('User already has this role', '');
        return;
      }

      await performActions(async () => {
        const gasLimit = await contractERC721EsolidarSweepstake.methods
          .grantRole(role, e.target.address.value)
          .estimateGas();

        await contractERC721EsolidarSweepstake.methods
          .grantRole(role, e.target.address.value)
          .send({ from: address, gasLimit });

        sweetAlertSuccess('Success', 'You have been granted the role');
      });
    } catch (e: any) {
      sweetAlertError('Error', e.message);
    }
  };

  const revokeRole = async (e: any, role: any) => {
    e.preventDefault();
    try {
      const hasHole = await contractERC721EsolidarSweepstake.methods
        .hasRole(role, e.target.address.value)
        .call();
      if (!hasHole) {
        sweetAlertError('User does not have this role', '');
        return;
      }

      await performActions(async () => {
        const gasLimit = await contractERC721EsolidarSweepstake.methods
          .revokeRole(role, e.target.address.value)
          .estimateGas();

        await contractERC721EsolidarSweepstake.methods
          .revokeRole(role, e.target.address.value)
          .send({ from: address, gasLimit });

        sweetAlertSuccess('Success', 'You have revoked the role');
      });
    } catch (e: any) {
      sweetAlertError('Error', e.message);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>Role Manager</h1>
      <div className="d-flex justify-content-center">
        <div className="d-flex flex-column justify-content-center align-items-center mx-3">
          <span>Add role admin</span>
          <form
            onSubmit={e => grantRole(e, process.env.NEXT_PUBLIC_ADMIN_ROLE)}
            className="d-flex flex-column"
          >
            <input type="text" name="address" placeholder="address" />
            <button type="button">Add</button>
          </form>
          <span>Remove role admin</span>
          <form
            onSubmit={e => revokeRole(e, process.env.NEXT_PUBLIC_ADMIN_ROLE)}
            className="d-flex flex-column"
          >
            <input type="text" name="address" placeholder="address" />
            <button type="button">Remove</button>
          </form>
        </div>

        <div className="d-flex flex-column justify-content-center align-items-center mx-3">
          <span>Add role minter</span>
          <form
            onSubmit={e => grantRole(e, process.env.NEXT_PUBLIC_MINTER_ROLE)}
            className="d-flex flex-column"
          >
            <input type="text" name="address" placeholder="address" />
            <button type="button">Add</button>
          </form>
          <span>Remove role minter</span>
          <form
            onSubmit={e => revokeRole(e, process.env.NEXT_PUBLIC_MINTER_ROLE)}
            className="d-flex flex-column"
          >
            <input type="text" name="address" placeholder="address" />
            <button type="button">Remove</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoleManager;
