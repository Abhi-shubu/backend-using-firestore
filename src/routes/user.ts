import { Router } from 'express';
import { createUser,getUsers,getUserById , updateUser} from '../controllers/usercontroller';

const router = Router();


router.post('/', createUser);
router.get('/',getUsers);
router.get('/:id', getUserById);
router.put('/:id',updateUser)
export default router;
