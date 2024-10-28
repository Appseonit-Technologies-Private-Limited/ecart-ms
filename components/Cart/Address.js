import { useContext, useEffect, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import { ADDRESS_DEL, ADDRESS_EDIT, ADDRESS_NEW } from "../../utils/constants";
import isEmpty from 'lodash/isEmpty';
import { useRouter } from "next/router";
import AddressForm from "../AddressForm/AddressForm";
import { AddressFormPopup } from "../AddressForm/AddressFormPopup";
import { updateAddress } from "../AddressForm/util";
import { DeleteIcon, EditAddressIcon, PlusIcon } from "../Icons/Icon";
import { MdOutlineEditLocationAlt } from "react-icons/md";
const Address = ({ isProfilePage, addressData }) => {


    const [addresses, setAddresses] = useState(addressData)
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [newAddPanelVisible, setNewAddPanelVisible] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (addresses) {
            const defaultAddress = addresses.find(address => address.default);
            if (defaultAddress) dispatch({ type: 'ADD_ADDRESS', payload: defaultAddress });
        }
    }, [addresses]);

    const handleAddressChange = (i, saveType) => {
        if (saveType === ADDRESS_EDIT) return AddressFormPopup(dispatch, addresses[i], saveType, isProfilePage);
        else if (saveType === ADDRESS_DEL) {
            updateAddress(ADDRESS_DEL, addresses[i], dispatch, auth);
            return router.reload('/profile')
        }
    }

    return (
        <>
            {
                !isEmpty(addresses) ?
                    <>
                        {
                            addresses.map((item, i) => (
                                <div key={i} className={`row my-3 justify-content-between address-container ${item.default && 'default-address'}`}
                                    onClick={() => { handleAddressChange(i, ADDRESS_EDIT) }}>
                                    <div className="col">
                                        <label>
                                            {item.fullName}
                                            {isProfilePage && <span className="mx-1">{item.default && '(Default)'}</span>}
                                        </label>
                                        <p>
                                            <span className="text-black">
                                                {item.address},<br />
                                                {item.city}, {item.countryState},<br />
                                                {item.country}, Pin Code: {item.pincode}<br />
                                                Phone number: {item.phoneNumber}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="col-4 d-flex justify-content-end align-items-center">
                                        <a onClick={() => { handleAddressChange(i, ADDRESS_EDIT) }}><EditAddressIcon /></a>
                                        <a className='mx-2' onClick={() => { handleAddressChange(i, ADDRESS_DEL) }}><DeleteIcon /></a>
                                    </div>

                                </div>
                            ))
                        }
                    </> : <p className="text-center fst-italic fw-light text-muted"> No Address saved yet!</p>
            }
            <>
                <div className="row pt-3 my-3 justify-content-center">
                    <button className="btn btn-primary px-5" onClick={e => { setNewAddPanelVisible(true) }}>Add a New Address</button>
                </div>
                {newAddPanelVisible && <AddressForm addressObj={{}} saveType={ADDRESS_NEW} isProfilePage={isProfilePage} />}
            </>
        </>
    );
}

export default Address;