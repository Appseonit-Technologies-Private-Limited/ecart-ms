import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { TbSearch } from "react-icons/tb";
const ProductSearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        // Add your search logic here
    };

    return (
        <Form className='d-flex w-100'>
            <InputGroup className="product-search-bar justify-content-center">
                <InputGroup.Text className="search-icon">
                    <TbSearch />
                </InputGroup.Text>
                <Form.Control
                    className="search-text-area"
                    type="text"
                    placeholder="Search your items..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
            </InputGroup>
        </Form>
    );
};

export default ProductSearchBar;