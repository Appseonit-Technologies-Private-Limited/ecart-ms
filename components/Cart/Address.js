import { useContext, useEffect, useRef, useState } from "react";
import { DataContext } from "../../store/GlobalState";
import { ADDRESS_DEL, ADDRESS_EDIT, ADDRESS_NEW, PROCESSING_MSG } from "../../utils/constants";
import isEmpty from 'lodash/isEmpty';
import { useRouter } from "next/router";
import AddressForm from "../AddressForm/AddressForm";
import { AddressFormPopup } from "../AddressForm/AddressFormPopup";
import { updateAddress } from "../AddressForm/util";
import { DeleteIcon, EditAddressIcon, PlusIcon } from "../Icons/Icon";
import { log_info } from "../../middleware/log";
const Address = ({ isProfilePage, addressData }) => {


    const [addresses, setAddresses] = useState([]);
    const { state, dispatch } = useContext(DataContext)
    const { auth } = state
    const [newAddPanelVisible, setNewAddPanelVisible] = useState(false)
    const formRef = useRef(null);

    useEffect(() => {
        if (addressData) {
            setAddresses(addressData);
            const defaultAddress = addressData.find(address => address.default);
            if (defaultAddress) dispatch({ type: 'ADD_ADDRESS', payload: defaultAddress });
        }
    }, [addressData]);

const handleAddNewAddressClick = (e) => {
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      setNewAddPanelVisible(true);
}

    const DeletePopupContent = ({ addressToDel, delIndex, cb }) => {
        return (<>
            <span className="text-black">
                <span className="fw-bold">{addressToDel.fullName}</span>,<br />
                {addressToDel.address},<br />
                {addressToDel.city}, {addressToDel.countryState},<br />
                {addressToDel.country}, Pin Code: {addressToDel.pinCode}<br />
                Phone number: {addressToDel.phoneNumber}
            </span>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={()=>{cb(addressToDel, delIndex)}}>Yes</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">Cancel</button>
            </div>
        </>);
    }
    const handleAddressChange = (i, saveType) => {
        if (saveType === ADDRESS_EDIT && i >= 0 && i < addresses.length) {
            const addressEditCB = (editedAddress, editedIndex) => {
                const filteredAddresses = addresses.filter((address, i) => i !== editedIndex);
                if(editedAddress && editedAddress.default){
                    filteredAddresses.map(address => ({
                        ...address,
                        default: false
                      }));
                }
                setAddresses([editedAddress, ...filteredAddresses]);
            };
            log_info('Editing Address : ', addresses[i])
            AddressFormPopup(dispatch, addresses[i], saveType, isProfilePage, addressEditCB, i);
        } else if (saveType === ADDRESS_DEL && i >= 0 && i < addresses.length) {
            if (addresses.length === 1) return dispatch({ type: 'NOTIFY', payload: { error: 'You need to keep at least one saved address for delivery. Please add another address before deleting this one.' } })
            if(addresses[i].default) return dispatch({ type: 'NOTIFY', payload: { error: 'Unable to delete this address! Please ensure at least one address is set as the default.' } })
                $('#confirmModal').modal('show');
            const cb = (addressToDel, delIndex) => {
                updateAddress(ADDRESS_DEL, addressToDel, dispatch, auth);
                const updatedAddresses = addresses.filter((address, index) => index !== delIndex);
                setAddresses(updatedAddresses);
            };
            dispatch({
                type: 'ADD_MODAL',
                payload: {
                    title: `Are you sure you want to delete this address?`,
                    content: <DeletePopupContent addressToDel={addresses[i]} delIndex={i} loadingMsg={PROCESSING_MSG} isPopUp={true} cb={cb}/>,
                    data: {},
                    type: ADDRESS_EDIT,
                }
            });
        }
    }

    const handleNewAddressSave = (newAddress) => {
        setAddresses([newAddress, ...addresses]);
        setNewAddPanelVisible(false);
        window.scrollTo({ top: 80, behavior: 'smooth' });
    }

    return (
        <>
            {
                !isEmpty(addresses) ?
                    <>
                        {
                            addresses.map((item, i) => (
                                <div key={i} className={`row my-3 justify-content-between address-container ${item.default && 'default-address'}`}>
                                    <div className="col">
                                        <label>
                                            {item.fullName}
                                            {isProfilePage && <span className="mx-1">{item.default && '(Default)'}</span>}
                                        </label>
                                        <p>
                                            <span className="text-black">
                                                {item.address},<br />
                                                {item.city}, {item.countryState},<br />
                                                {item.country}, Pin Code: {item.pinCode}<br />
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
                    <button className="btn btn-primary px-5" onClick={e => { handleAddNewAddressClick(e) }}>Add a New Address</button>
                </div>
                {newAddPanelVisible && <AddressForm formRef={formRef} addressObj={{}} saveType={ADDRESS_NEW} isProfilePage={isProfilePage} handleNewAddressSave={handleNewAddressSave} />}
            </>
        </>
    );
}

export default Address;