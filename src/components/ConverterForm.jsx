import { useEffect, useState } from "react"
import CurrencySelect from "./CurrencySelect"

const ConverterForm = () => {

    const [amount, setAmount] = useState(100);
    const [FromCurrency, setFromCurrency] = useState ("USD");
    const [ToCurrency, setToCurrency] = useState ("INR");
    const [result, setResult] = useState ("");
    const [isLoading, setIsLoading] = useState (false);

    // Inverter as moedas usando o bottom 
    const handleSwapCurrencies = () => {
      setFromCurrency(ToCurrency);
      setToCurrency(FromCurrency);

    }

    // Buscar a taxa de cambio na API e atualizar o resultado
    const getExchangeRate = async () => {
      const API_KEY = import.meta.env.VITE_API_KEY;
      const API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${FromCurrency}/${ToCurrency}`;

      setIsLoading(true);

      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error("Something went wrong!");

        const data = await response.json();
        const rate = (data.conversion_rate * amount).toFixed(2);
        setResult(`${amount} ${FromCurrency} = ${rate} ${ToCurrency}`);
      } catch (error){
        console.log(error);
      } finally {
        setIsLoading(false);
      }
      
      


    }
    
    const handleFormSubmit = (e) => {
      e.preventDefault();
      getExchangeRate();
    }
   useEffect (() => getExchangeRate, []);

  return (
    <form className="converter-form" onSubmit={handleFormSubmit}>
      <div className="form-group">
      <label className="form-label">Insira o valor</label>
      <input type="number" className="form-input" value={amount} onChange={e => setAmount(e.target.value)} required />
      </div>

      <div className="form-group form-currency-group">
        <div className="form-section">
          <label className="form-label">De</label>
          <CurrencySelect
                selectedCurrency ={FromCurrency}
                handleCurrency = {e => setFromCurrency(e.target.value)}
          />
        </div>

        <div className="swap-icon" onClick={handleSwapCurrencies}>
        <svg width="16" viewBox="0 0 20 19" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M19.13 11.66H.22a.22.22 0 0 0-.22.22v1.62a.22.22 0 0 0 .22.22h16.45l-3.92 4.94a.22.22 0 0 0 .17.35h1.97c.13 0 .25-.06.33-.16l4.59-5.78a.9.9 0 0 0-.7-1.43zM19.78 5.29H3.34L7.26.35A.22.22 0 0 0 7.09 0H5.12a.22.22 0 0 0-.34.16L.19 5.94a.9.9 0 0 0 .68 1.4H19.78a.22.22 0 0 0 .22-.22V5.51a.22.22 0 0 0-.22-.22z"
        fill="#fff"
    />
</svg>
      </div>  
        
        
        

        <div className="form-section">
          <label className="form-label">Para</label>
          <CurrencySelect
          selectedCurrency ={ToCurrency}
          handleCurrency = {e => setToCurrency(e.target.value)}
          />
        </div>
      </div>

<button type="submit" className={`${isLoading? "loading" : ""} submit-button`}>Obter taxa de câmbio
</button>

<p className="enxange-rate-result">{isLoading? "Obtendo taxa de câmbio..." : result}</p>
      </form>
  )
}

export default ConverterForm