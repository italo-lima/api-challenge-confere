# API - CONFERE

:rocket: API desenvolvida com NodeJS + MongoDB + JWT + Jest + LocalStorage + Socket.io + celebrate

## Parâmetros das requisições são definidos previamente, Seja por body, query ou param. 

## Começando

- Clone este repositório.
- \$ Rode `yarn` no diretório raiz.
- \$ yarn dev

## Authentication

### Signin:

`POST /session`: login com credenciais válidas.

#### Body example:

```
{
	"email": "italo@email.com",
	"password": "123456"
}
```
#### :warning: A execução dos endpoints a seguir, necessitam de autenticação do usuário

## User

`POST /transaction`: cria uma nova transação

#### Body example:

```
{
	"value": 100.00, 
	"description": "Bebe", 
	"type": "debit", 
	"installments": null,
	"card": {
		"number": "5200555500001234",
		"expiry": "21/22", 
		"cvv": "144",
		"holder": "Fulano de tal"
	}
}
```

`GET /transaction`: Retorna as transações do usuário autenticado.
### Permitido filtros:
Possibilidades -> type, limit, minValue, maxValue


`PUT /transaction/idTransaction/idReceived`: altera o status da transação.

#### Body example:

```
{
	"status": "received"
}
```

`DELETE /transaction/idTransaction`: exclui uma transação do usuário autenticado.
