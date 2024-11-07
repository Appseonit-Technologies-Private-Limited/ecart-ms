import { ADDRESS_EDIT } from "../../utils/constants";
import AddressForm from "./AddressForm";


export const AddressFormPopup = (dispatch, address, saveType, isProfilePage, cb, addressIndex) => {
    
      $('#confirmModal').modal('show');
      dispatch({
        type: 'ADD_MODAL',
        payload: {
          title: 'Edit Address',
          content: <AddressForm addressObj={address} saveType={saveType} isProfilePage={isProfilePage} addressEditCB={cb} addressIndex={addressIndex}/>,
          data: {},
          type: ADDRESS_EDIT
        }
      })
}