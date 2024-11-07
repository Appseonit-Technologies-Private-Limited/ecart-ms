import { log_info } from "../../middleware/log";

export const validateAddress = (address) => {
  const numRegex = /^[0-9]+$/;
  log_info('Validating address : ', address)
  if (!address) return 'Please select an address to continue.';
  if (!address.fullName || !address.address || !address.phoneNumber || !address.city || !address.countryState || !address.country || !address.pinCode) return 'Please provide all your details to continue.';
  if (address.fullName && address.fullName.length < 4) return 'Please enter a valid full name to continue.';
  if (!(address.address.length >= 15)) return 'Please enter the address in the format: Flat, House Number, Building Name, Street Address.';
  if (!address.city || address.city === '') return 'Please enter the city name.';
  if (!address.countryState || address.countryState === '') return 'Please enter the state or province.';
  if (!address.country || address.country === '') return 'Please enter the country name.';
  if (!(numRegex.test(address.pinCode)) || !(address.pinCode.length >= 6 || address.pinCode.length >= 10)) return 'Please enter a valid PIN code';
  if (!(numRegex.test(address.phoneNumber)) || !(address.phoneNumber.length >= 10)) return 'Please enter a valid phone number.';
}