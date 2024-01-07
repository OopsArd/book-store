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
    const [isMinInputQuantity, setMin] = useState(null)
    const [isRuleImport, setRuleImport] = useState(null)
    const [isRuleInvoice, setRuleInvoice] = useState(null)

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

    useEffect(() => {
        if(rules.length > 0){
            const RULE_INPUT_QUANTITY = rules.find(rule => rule.rule_name === "MIN_INPUT_QUANTITY_BOOK");

            let ru = {value: RULE_INPUT_QUANTITY.value, is_use: RULE_INPUT_QUANTITY.is_use, description: RULE_INPUT_QUANTITY.description};
            setMin(ru)
        }
    },[rules])
    useEffect(() => {
        if(rules.length > 0){
            const RULE_IMPORT = rules.find(rule => rule.rule_name === "MAX_INVENTORY_ALLOW_INPUT")
            let ru = {value: RULE_IMPORT.value, is_use: RULE_IMPORT.is_use, description: RULE_IMPORT.description};
            setRuleImport(ru)
        }
    },[rules])
    useEffect(() => {
        if(rules.length > 0){
            const RULE_INVOICE = rules.find(rule => rule.rule_name === "MIN_REMAINING_QUANTITY_SELL_WITH_DEPT")

            let ru = {value: RULE_INVOICE.value, is_use: RULE_INVOICE.is_use, description: RULE_INVOICE.description};
            setRuleInvoice(ru)
        }
    },[rules])

    
    const handleInputName = (dataInput) => {
        let check = books.find(book => book.title.toLowerCase() === dataInput.toLowerCase());
        if(check){
            setName(dataInput);
            setErrName(null)
        }else{
            setErrName({title: 'Sách không tồn tại', type: 'error'})
        }
    }

    const handleInputQuantity = (dataInput) => {
        switch(title){
            case "IMPORT":
                console.log("is min: ", isMinInputQuantity)
                if(isMinInputQuantity?.is_use == 'true'){
                    if(dataInput >= Number(isMinInputQuantity?.value)){
                        setQuantity(dataInput);
                        setErrQuantity(null);
                        return
                    }
                    setQuantity(null);
                    setErrQuantity(
                    {
                        title: isMinInputQuantity?.description,
                    });
                    return
                }
                setQuantity(dataInput);
                setErrQuantity(null);
                break;
            case "INVOICE":
                setQuantity(dataInput);
        }
    }

    const handleAdd = () => {
        switch(title){
            case "IMPORT": 
                if(name && quantity){
                    const check = books.find(book => book.title.toLowerCase() == name.toLowerCase());
                    if(isRuleImport?.is_use == 'true'){
                        console.log("check: ", check)
                        if(check){
                            if(check.quantity >= Number(isRuleImport?.value)){
                                setAle({title: `Chỉ nhập các đầu sách có số lượng tồn ít hơn ${Number(isRuleImport?.value)}`, type: 'error'})
                                return
                            }
                            const dataAdd = {...check, title: name, quantity: quantity};
                            handleBooks(dataAdd);
                            return
                        }
                    }
                    const dataAdd = {...check, title: name, quantity: quantity};
                    handleBooks(dataAdd);
                }else{
                    setAle({title: "Sách và số lượng không hợp lệ", type: 'error'})
                }
                break;
            case "INVOICE":
                if(name && quantity){
                    const check = books.find(book => book.title.toLowerCase() === name.toLowerCase());
                   if(isRuleInvoice?.is_use == 'true'){
                        let quantityAfterSale = Number(check.quantity) - Number(quantity);
                        if(quantityAfterSale <= Number(isRuleInvoice.value)){
                            setAle({title: `Số lượng tồn còn lại sẽ ít hơn ${Number(isRuleInvoice?.value)}`, type: 'error'})
                            return
                        }
                        const dataAdd = {...check, title: name, quantity: Number(quantity)};
                        handleBooks(dataAdd);
                   }
                    const dataAdd = {...check, title: name, quantity: Number(quantity)};
                    handleBooks(dataAdd);
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