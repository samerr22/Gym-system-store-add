import  express  from "express";
import { verifyToken } from '../Middleware/VerfiyUser.js';
import { Cartcrete, CheckOutcrete, Itcreate,  checkout, deleteItems, deleteItemss, deleteitems, getAllItems, getCartItem, getitems, updateitem } from "../controllers/items.controller.js";



const router = express.Router();

router.post('/Itcreate', verifyToken, Itcreate);
router.get('/getAllItems', getAllItems);
router.get('/getItem/:ItemsId', getitems);
router.post('/Cart',  Cartcrete);
router.get('/cartitem/:CurrentuserId', getCartItem)
router.post('/Checkout',  CheckOutcrete);
router.delete('/deleteitems/:itemsId',  deleteItems)
router.delete('/deletCurretId/:CurrentuserId',verifyToken,  deleteItemss)
router.get('/itemDetails/:CurrentuserId', checkout)
router.put('/updateitem/:itemId', verifyToken, updateitem)
router.delete('/deleteitem/:itemsId', verifyToken, deleteitems)





export default router;