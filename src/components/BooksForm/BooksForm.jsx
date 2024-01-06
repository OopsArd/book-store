import {React, useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../redux/slice/bookSlice';
import { fetchRules } from '../../redux/slice/ruleSlice';

import FloatInput from '../FloatInput/FloatInput'
import Success from '../Popup/Success';
import './booksform.css'

const BooksForm = ({title, handleBooks}) => {
    const dispatch = useDispatch();
    const books = useSelector((state) => state.books.books)
    const rules = useSelector((state) => state.rules.rules)

    const [name, setName] = useState();
    const [quantity, setQuantity] = useState();
    const [err_name, setErrName] = useState(null);
    const [err_quantity, setErrQuantity] = useState(null);

    const [isOpen, setOpen] = useState(false);
    const [ale, setAle] = useState();
  
    const handleOpen = (value) => {
      setOpen(value)
    }
  
    useEffect(() => {
      if(ale){
        setOpen(true)
      }
    },[ale])

    
    const handleInputName = (dataInput) => {
        let check = books.find(book => book.title.toLowerCase() === dataInput.toLowerCase());
        console.log("check: ", check)
        if(check){
            setName(dataInput);
            setErrName(null)
        }else{
            setErrName({title: 'Sách không tồn tại', type: 'error'})
        }
    }

    const handleInputQuantity = (dataInput) => {
        const RULE_INPUT_QUANTITY = rules.find(rule => rule.rule_name === "MIN_INPUT_QUANTITY_BOOK")
        switch(title){
            case "IMPORT":
                if(RULE_INPUT_QUANTITY.is_use){
                    if(dataInput >= Number(RULE_INPUT_QUANTITY.value)){
                        setQuantity(dataInput);
                        setErrQuantity(null);
                        return
                    }
                    setQuantity(null);
                    setErrQuantity(
                    {
                        title: RULE_INPUT_QUANTITY.description,
                    });
                }
                if(!RULE_INPUT_QUANTITY.is_use){
                    setQuantity(dataInput);
                    setErrQuantity(null);
                }

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
                    if(RULE_IMPORT.is_use){
                        let check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
                        if(check.quantity >= Number(RULE_IMPORT.value)){
                            setAle({title: `Chỉ nhập các đầu sách có số lượng tồn ít hơn ${Number(RULE_IMPORT.value)}`, type: 'error'})
                            return
                        }
                        const dataAdd = {...check, title: name, quantity: quantity};
                        handleBooks(dataAdd);
                    }
                    if(!RULE_IMPORT.is_use){
                        const dataAdd = {...check, title: name, quantity: quantity};
                        handleBooks(dataAdd);
                    }
                }else{
                    setAle({title: "Sách và số lượng không hợp lệ", type: 'error'})
                }
                break;
            case "INVOICE":
                const RULE_INVOICE = rules.find(rule => rule.rule_name === "MIN_REMAINING_QUANTITY_SELL_WITH_DEPT")
                if(name && quantity){
                   if(RULE_INVOICE.is_use){
                    let check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
                    let quantityAfterSale = Number(check.quantity) - Number(quantity);
                    if(quantityAfterSale <= Number(RULE_INVOICE.value)){
                        setAle({title: `Số lượng tồn còn lại sẽ ít hơn ${Number(RULE_INVOICE.value)}`, type: 'error'})
                        return
                    }
                    const dataAdd = {...check, title: name, quantity: Number(quantity)};
                    handleBooks(dataAdd);
                   }
                   if (!RULE_INVOICE.is_use) {
                    const dataAdd = {...check, title: name, quantity: Number(quantity)};
                    handleBooks(dataAdd);
                   }
                }else{
                    setAle({title: "Sách và số lượng không hợp lệ", type: 'error'})
                }
                break;
            default: setAle({title: "Không tồn tại nghiệp vụ", type: 'error'});
        }
    }

    useEffect(() => {
        dispatch(fetchBooks());
    }, [])


    useEffect(() => {
        dispatch(fetchRules());
    }, []);


    return (
       <>
        {isOpen && <Success data={ale} handleOpen={handleOpen} /> }
        <div className={`books-form  ${isOpen ? 'overlay' : ''} `}>
            <div className="input_books_form">
                <FloatInput disable={false} handleDisable={() => false} className="input_pos" handleInput={handleInputName} label="Tên sách" placeholder="Tên sách" name="book_name" />
                { err_name && <span className="err_name">{err_name.title}</span>}
                <FloatInput disable={false} handleDisable={() => false} className="input_quantity" handleInput={handleInputQuantity} label="Số lượng" placeholder="Số lượng" name="book_quantity" />
                { err_quantity && <span className="err_quantity">{err_quantity.title}</span>}
                <button onClick={handleAdd} className='btnAdd'>Thêm</button>
            </div>
        </div>
       </>
    )
}

export default BooksForm