---
sidebar_position: 4
---

# Defining Output

You can define output a sample output can be seen below

``` typescript

{
    name: `$Input{name}`,
    details:  {
        transaction_id: `$Sequence{process_payment}{debit_payment}{trx_id}`,
        timestamp: `$Sequence{process_payments}{settle_payment}{timestamp}`,
    }
}

```