const addButtonElem = document.querySelector('#add-tx-button');
addButtonElem.addEventListener('click', () => {
    if(document.forms[0].dataset.id != '-1')
    {
        document.forms[0].dataset.id = '-1';
        document.forms[0].reset();
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    else if(document.forms[0].style.display == 'none')
        document.forms[0].style.display = '';
    else
        document.forms[0].style.display = 'none';
});

const closeButtonElem = document.querySelector('#close-form-button');
closeButtonElem.addEventListener('click', () => {
    if(document.forms[0].dataset.id != '-1')
    {
        document.forms[0].dataset.id = '-1';
        document.forms[0].reset();
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    document.forms[0].style.display = 'none';
});

document.forms[0].onsubmit = () =>{
    const zam = document.querySelector('#zamet-tx');
    
    

    if(zam.value == '' )
    {
        alert('Введите все необходимые данные');
        return false;
    }

    if(document.forms[0].dataset.id == '-1')
    {    
        fetch('/last-id')
        .then(res => res.text())
        .then(result =>{
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${result}</td>
                                <td>${zam.value}</td>
                                <td><input type="button" value="Изменить" 
                                    data-id="${result}" onclick="EditHandler(this)"/></td>
                                <td><input type="checkbox" data-id="${result}"/></td>`;
            document.querySelector('#table-body').append(newRow);
            fetch('/zam', 
            {
                method: 'PUT', 
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify({id: result, 
                   zam: zam.value,
                    })
            });
            document.forms[0].reset();
        });
    }
    else
    {
        fetch('/zam', 
        {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({id: document.forms[0].dataset.id, 
                zam: zam.value
                })
        });

        const rows = document.querySelector('#table-body').querySelectorAll('tr');
        let i = 0;
        for(; i < rows.length; i++)
            if(rows[i].querySelector('td').innerHTML == document.forms[0].dataset.id)
                break;

        const cells = rows[i].querySelectorAll('td');
        cells[1].innerHTML = zam.value;
     

        document.forms[0].reset();
        document.forms[0].dataset.id = '-1';
        document.querySelector('#confirm-button').value = 'Добавить';
    }
    return false;
};

const deleteButtonElem = document.querySelector('#delete-tx-button');
deleteButtonElem.addEventListener('click', () =>{
    const a = [];
    const rows = document.querySelector('#table-body').querySelectorAll('tr');
    for(let i = 0; i < rows.length; i++)
    {
        const e = rows[i].querySelectorAll('input')[1];
        if(e.checked)
        {
            a.push(e.dataset.id);
            rows[i].remove();
        }
    }

    if(a.length == 0)
    {
        alert('Не выбрано ни одной записи');
        return;
    }
    
    fetch('/zam', 
        {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(a)
        });
    
});

function EditHandler(elem)
        {
            document.forms[0].style.display = '';
            document.forms[0].dataset.id = elem.dataset.id;
            document.querySelector('#confirm-button').value = 'Применить';
            const elems = elem.parentElement.parentElement.querySelectorAll('td');
            document.querySelector('#zamet-tx').value = elems[1].innerHTML;
      
        }