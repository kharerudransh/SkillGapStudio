import {createContext , useState} from "react";

export const InterviewContext = createContext();


export const InterviewProvider = ({children}) => {
    const [reports,setReports] = useState([]);
    const [loading,setLoading]=useState(false);
    const [report , setReport]=useState(null);
    
    return (
        <InterviewContext.Provider value={{report , setReport , reports,loading,setReports,setLoading }}>
            {children}
        </InterviewContext.Provider>
    )
}