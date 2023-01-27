import { useEffect, useRef, useState } from 'react'
import investedLogo from './assets/logoinvestedhd.svg'
import {
  Heading,
  Box,
  Flex,
  Spacer,
  Tag,
  Text,
  Button,
  Divider,
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Input,
  Select
} from '@chakra-ui/react'
import { AddIcon, ArrowLeftIcon, ArrowRightIcon } from '@chakra-ui/icons'
import { paymentData } from './payments/payments'
import { customerData } from './customers/customers'
import { creditData } from './credits/credits'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

export function App() {
  /**
   * Constants section
   */
  const [view, setView] = useState('cust')
  const [backView, setBackView] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [currentCid, setCurrentCid] = useState(0)
  const [currentCname, setCurrentCname] = useState(0)
  const [currentCode, setCurrentCode] = useState('')
  const [custCreds, setCustCreds] = useState([])
  const [customers, setCustomers] = useState([])
  const [payments, setPayments] = useState([])
  const [names, setNames] = useState('')
  const [lName, setLName] = useState('')
  const [amount, setAmount] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const showToastMessage = (id) => {

    paymentData.find(p => p.id == id).status = 'procesando'
    setView('dopaym')
    setTimeout(() => {
      paymentData.find(p => p.id == id).status = 'pagado'
      toast.success('¡Pago registrado exitosamente!', {
        position: toast.POSITION.TOP_RIGHT
        
      });
      if (paymentData.filter(p => p.creditCODE == currentCode && p.status == 'pagado').length == 4) {
        creditData.find(c => c.code == currentCode).status = 'Liquidado'
        toast.success('¡El crédito ' + currentCode + ' ha sido liquidado!', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
      setView('dopaym')
    }, 2000);

  };

  /** Hooks */
  useEffect(() => {
    setCustomers(customerData)
  }, [])

  useEffect(() => {
    switch (view) {
      case 'cust':
        setTitle('Clientes')
        setSubtitle('')
        break;
      case 'cred':
        setTitle('Créditos')
        setSubtitle('Cliente: ' + currentCname)
        setCustCreds(creditData.filter(c => c.customerId == currentCid))
        break;
      case 'paym':
        setTitle('Pagos')
        setSubtitle('Crédito: ' + currentCode)
        setPayments(paymentData.filter(p => p.creditCODE == currentCode))
        break;
      case 'dopaym':
        setView('paym')
        break;
    }
  }, [view])

/**
 * Function to get credits data
 * @param {*} id The customer's id
 * @param {*} name The customer's name
 */
  function getCredits(id, name) {
    setView('cred')
    setBackView('cust')
    setCurrentCid(id)
    setCurrentCname(name)
  }

  /**
   * Function to get the payments from a credit
   * @param {*} code The credit code identification
   */
  function getPayments(code) {
    setView('paym')
    setBackView('cred')
    setCurrentCode(code)

  }

  /**
   * Funtion to back to the previous screen
   */
  function setBack() {
    setView(backView);
    if (backView == 'cust') {
      setBackView('')
    } else if (backView == 'cred') {
      setBackView('cust')
    }
  }

  /**
   * Function to add a new customer
   */
  function addCustomer() {

    if (names == '' || lName == '' || amount == '') {
      toast.error('¡Falta información!, por favor verifica', {
        position: toast.POSITION.TOP_RIGHT
      });
      setIsAdded(true)
    } else {
      const cid = customerData.length + 1;
      const code = 'CUS' + cid + 'CRE1';
      const pamount = amount / 4;
      const ncustomer = {
        id: cid,
        name: names,
        lname: lName
      }
      const ncredit = {
        id: creditData.length + 1,
        customerId: cid,
        code: code,
        totalAmount: amount + '.00',
        status: 'activo'
      }
      const npayments = [{
        id: paymentData.length + 1,
        paymentNum: 1,
        creditCODE: code,
        amount: pamount + '.00',
        status: 'pendiente'
      },
      {
        id: paymentData.length + 2,
        paymentNum: 2,
        creditCODE: code,
        amount: pamount + '.00',
        status: 'pendiente'
      },
      {
        id: paymentData.length + 3,
        paymentNum: 3,
        creditCODE: code,
        amount: pamount + '.00',
        status: 'pendiente'
      },
      {
        id: paymentData.length + 4,
        paymentNum: 4,
        creditCODE: code,
        amount: pamount + '.00',
        status: 'pendiente'
      }]
      customerData.push(ncustomer)
      creditData.push(ncredit)
      npayments.forEach((npay) => {
        paymentData.push(npay)
      })
      setNames('')
      setLName('')
      setAmount('')
      setIsAdded(false)
      onClose()
    }
  }

  return (
    <div className="App">
      <div>
        <a href="https://invested.mx" target="_blank">
          <img src={investedLogo} className="logo react" alt="React logo" />
        </a>
        <section>
          <Heading as='h1' size='xl' color='#154c79'>
            <Flex align='center'>
              <Text>{title}</Text>
              <Spacer />
              {view == 'cust' ? <Button onClick={onOpen} rightIcon={<AddIcon />} variant='ghost'> Agregar</Button> : <></>}
            </Flex>
          </Heading>
          <Heading as='h4' size='sm' m={2} color='#1e81b0'>
            <Flex align='center'>
              <Text>{subtitle}</Text>
            </Flex>
          </Heading>
          <Divider />
        </section>
        <section>
          {view == 'paym' || view == 'dopaym' ?
            payments.length > 0 ?
              payments.map((payment) => (
                <Box key={payment.id} color='white' w='100%' bg='#388fb8' borderRadius='10px' p='10px' m='10px'>
                  <Flex align='center'>
                    <Text><strong> Amortización {payment.paymentNum} de 4 </strong> </Text>
                    <Spacer />
                    <Text> $ {payment.amount} </Text>
                    <Spacer />
                    {payment.status == 'pendiente' ?
                      <Tag cursor='pointer' w={20} onClick={() => showToastMessage(payment.id)} p={1} colorScheme='yellow'>
                        <Text w='100%' textAlign='center'>Pagar</Text>
                      </Tag> :
                      payment.status == 'procesando' ?
                        <Tag cursor='pointer' w={20} colorScheme='linkedin'>
                          <Text w='100%' textAlign='center'> <Spinner size='sm' /></Text>
                        </Tag> :
                        <Tag w={20} p={1} colorScheme='teal'>
                          <Text w='100%' textAlign='center'>Pagado</Text>
                        </Tag>
                    }

                  </Flex>
                </Box>
              )) : <h3>No se han registrados pagos para este crédito</h3> :
            view == 'cred' ? (custCreds.map((credit) => (
              <Box key={credit.id + credit.customerId} color='white' w='100%' bg='#388fb8' borderRadius='10px' p='10px' m='10px'>
                <Flex align='center'>
                  <Text mr={8}> <strong>{credit.code}</strong> </Text>
                  <Spacer />
                  <Text mr={8}> $ {credit.totalAmount} </Text>
                  <Spacer />
                  <Tag w={20} p={1} colorScheme={credit.status == 'Liquidado' ? 'teal' : 'cyan'} mr={15}>
                    <Text w='100%' textAlign='center'>{credit.status}</Text>
                  </Tag>
                  <Spacer />
                  <Button colorScheme='linkedin' variant='solid' color='white' onClick={() => { getPayments(credit.code) }} rightIcon={<ArrowRightIcon />} >Pagos</Button>
                </Flex>
              </Box>

            ))) : customers.map((customer) => (
              <Box key={customer.id} color='white' w='100%' bg='#388fb8' borderRadius='10px' p='10px' m='10px'>
                <Flex align='center'>
                  <Text><strong>{customer.id} </strong></Text>
                  <Spacer />
                  <Text><strong>{customer.name} {customer.lname} </strong></Text>
                  <Spacer />
                  <Button colorScheme='linkedin' variant='solid' color='white' onClick={() => { getCredits(customer.id, customer.name + ' ' + customer.lname) }} rightIcon={<ArrowRightIcon />}>Créditos</Button>
                </Flex>
              </Box>))}
          <Divider />
          <Box w='100%' mt={5}>
            <Flex>
              {backView != '' ? <Button leftIcon={<ArrowLeftIcon />} colorScheme='linkedin' variant='outline' onClick={() => { setBack() }}>Vover</Button> : <></>}
            </Flex>
          </Box>
          <ToastContainer />
        </section>
        <section>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>
                Nuevo Cliente
              </ModalHeader>
              <ModalCloseButton />
              <Divider />
              <ModalBody p={25}>
                <Input isInvalid={names == '' && isAdded} borderColor={names != '' ? '#5ba066' : 'transparent'} mb={10} value={names} onChange={(event) => setNames(event.target.value)} variant='filled' placeholder='Nombres' />
                <Input isInvalid={lName == '' && isAdded} borderColor={lName != '' ? '#5ba066' : 'transparent'}  mb={10} value={lName} onChange={(event) => setLName(event.target.value)} variant='filled' placeholder='Apellidos' />
                <Select isInvalid={amount == '' && isAdded} borderColor={amount != '' ? '#5ba066' : 'transparent'}  mb={10} value={amount} onChange={(event) => setAmount(event.target.value)} variant='filled' placeholder='Selecciona el monto de crédito'>
                  <option value='2000'>$ 2,000.00</option>
                  <option value='4000'>$ 4,000.00</option>
                  <option value='6000'>$ 6,000.00</option>
                  <option value='8000'>$ 8,000.00</option>
                  <option value='10000'>$ 10,000.00</option>
                </Select>
              </ModalBody>
              <Divider />
              <ModalFooter>
                <Button colorScheme='red' mr={3} onClick={onClose} w={80}>
                  Cancelar
                </Button>
                <Button colorScheme='green' w={80} onClick={addCustomer}>Agregar</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </section>

      </div>
    </div>
  )
}



