import { Route, Routes } from "react-router-dom";
import { DecisionDetails } from "../pages/DecisionDetail";
import { DecisionList } from "../pages/DecisionList";
import {DecisionNew} from "../pages/DecisionNew"

export function AppRoutes() {
    return (
        <Routes>
            <Route index element={<DecisionList/>}/>
            <Route path="/decisions/new" element={<DecisionNew/>}/>
            <Route path="/decisions/:iddecision" element={<DecisionDetails/>}/>
        </Routes>
    )
}