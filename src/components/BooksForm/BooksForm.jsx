import {React, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../redux/slice/bookSlice';
import { fetchRules } from '../../redux/slice/ruleSlice';

import FloatInput from '../FloatInput/FloatInput'

const BooksForm = ({title, handleBooks}) => {
    const dispatch = useDispatch();
    const books = useSelector((state) => state.books.books)
    const rules = useSelector((state) => state.rules.rules)

    const [name, setName] = useState();
    const [quantity, setQuantity] = useState();
    const [err_name, setErrName] = useState(false);
    const [err_quantity, setErrQuantity] = useState(false);
    
    const handleInputName = (dataInput) => {
        let check = books?.some(book => book?.title?.toLowerCase() === dataInput?.toLowerCase());
        if(check){
            setName(dataInput);
            setErrName(false);
            return
        }
        setName(null);
        setErrName(true);
    }
    
    const handleInputQuantity = (dataInput) => {
        const RULE_INPUT_QUANTITY = rules.find(rule => rule.rule_name === "MIN_INPUT_QUANTITY_BOOK")
        switch(title){
            case "IMPORT":
                if(dataInput >= Number(RULE_INPUT_QUANTITY.value)){
                    setQuantity(dataInput);
                    setErrQuantity(false);
                    return
                }
                setQuantity(null);
                setErrQuantity(true);
                break;
            case "INVOICE":
                setQuantity(dataInput);
        }
    }

    const handleAdd = () => {
        switch(title){
            case "IMPORT": 
                const RULE_IMPORT = rules.find(rule => rule.rule_name === "MAX_INVENTORY_ALLOW_INPUT")
                if(name && quantity){
                    let check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
                    if(check.quantity >= Number(RULE_IMPORT.value)){
                        alert("Chỉ nhập các đầu sách có số lượng tồn ít hơn 300")
                        return
                    }
                    const dataAdd = {...check, title: name, quantity: quantity};
                    handleBooks(dataAdd);
                }else{
                    alert("Nhập sách và số lượng")
                }
                break;
            case "INVOICE":
                const RULE_INVOICE = rules.find(rule => rule.rule_name === "MIN_REMAINING_QUANTITY_SELL_WITH_DEPT")
                if(name && quantity){
                    let check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
                    let quantityAfterSale = Number(check.quantity) - Number(quantity);
                    if(quantityAfterSale <= Number(RULE_INVOICE.value)){
                        alert("Số lượng tồn còn lại đã ít hơn 20");
                        return
                    }
                    const dataAdd = {...check, title: name, quantity: Number(quantity)};
                    handleBooks(dataAdd);
                }else{
                    alert("Nhập sách và số lượng")
                }
                break;
            default: alert("Không tồn tại nghiệp vụ");

        }
    }

    useEffect(() => {
        dispatch(fetchBooks());
    }, [])

    useEffect(() => {
        dispatch(fetchRules());
    }, []);



    return (
    <div className='books-form'>
        <div className="input">
            <FloatInput className="input_name" handleInput={handleInputName} label="Tên sách" placeholder="Tên sách" name="book_name" />
            { err_name && <span className="err_name">Sách không tồn tại</span>}
            <FloatInput className="input_quantity" handleInput={handleInputQuantity} label="Số lượng" placeholder="Số lượng" name="book_quantity" />
            { err_quantity && <span className="err_quantity">Số lượng nhập ít nhất là 150</span>}
            <button onClick={handleAdd} className='btnAdd'>Thêm</button>
        </div>
    </div>
    )
}

export default BooksForm