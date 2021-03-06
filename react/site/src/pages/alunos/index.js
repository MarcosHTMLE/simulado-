
import Cabecalho from '../../components/cabecalho'
import Menu from '../../components/menu'

import { Container, Conteudo } from './styled'

import { useState, useEffect } from 'react';

//import React from 'react';
import React, { useRef } from 'react'
import LoadingBar from 'react-top-loading-bar';

  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
  import 'react-toastify/dist/ReactToastify.css';
 
import Api from '../../services/api';
const api = new Api();


export default function Index() {

    const [alunos, setAlunos] = useState([]);
    const [nome, setNome] = useState('');
    const [chamada, setChamada] = useState('');
    const [turma, setTurma] = useState('');
    const [curso, setCurso] = useState('');
    const [idAlterando, setIdAlterando] = useState(0);

    const loading = useRef(null)

    async function listar() {
        let r = await api.listar();
        setAlunos(r);
    }

    async function inserir(){
        loading.current.continuousStart();
        if(chamada < 0 )
        return toast.error("Não é possível inserir números negativos na chamada")
        
        if(nome == '' || chamada == ''  || curso == '' || turma == '' )
        return toast.error("os campos são obrigatórios")
    
        if(idAlterando === 0){
            if(chamada < 0 )
            return toast.error('Número inválido')
       
            
            if(isNaN(chamada)){
              return  toast.error("O Campo Chamado só aceita números");
            }
            else{
            
                let r = await api.Inserir(nome,chamada,curso,turma);
                
                if(!r.erro)
                    toast.dark('💕 Aluno Inserido!')
                else
                    toast.dark('💕 Aluno Já existe!')

                    console.log(r)
            }
            loading.current.complete();
    
    
            
           
         } else {
           
            let r = await api.alterar(idAlterando, nome, chamada, curso, turma)
            toast.dark('💕 Aluno Alterado!')
            
           }
           limparCampos()
           listar()
       }

    function limparCampos() {
        setNome('');
        setChamada('');
        setCurso('');
        setTurma('');
        setIdAlterando(0);
    }

    async function remover(id){
        confirmAlert({
            title: 'Remover aluno',
            message: `Tem certeza que deseja remover o aluno ${id} ?`,
            buttons: [
                {
                    label:'Sim',
                    onClick: async () =>{
                        let r = await api.remover(id);
                        if(r.erro)
                        toast.error(`${r.erro}`);
                        else{
                            toast.dark('💕 Aluno removido!');
                            listar();
                        }
                    }
                },
                {
                    label:'Não'
                }
            ]
        });
       
    }
    

    async function editar(item) {
        setNome(item.nm_aluno);
        setChamada(item.nr_chamada);
        setCurso(item.nm_curso);
        setTurma(item.nm_turma);
        setIdAlterando(item.id_matricula);
    }

    useEffect(() => {
        listar();
    }, [])
    
    return (
        <Container>
            <ToastContainer />
            <LoadingBar color='#986CDF' ref={loading} />
            <Menu />
            <Conteudo>
                <Cabecalho />
                <div class="body-right-box">
                    <div class="new-student-box">
                        
                        <div class="text-new-student">
                            <div class="bar-new-student"></div>
                            <div class="text-new-student">{idAlterando == 0 ? "Novo Aluno" : "Alterando Aluno " + idAlterando } </div>
                        </div>

                        <div class="input-new-student"> 
                            <div class="input-left">
                                <div class="agp-input"> 
                                    <div class="name-student"> Nome: </div>  
                                    <div class="input"> <input type="text" value={nome} onChange={e => setNome(e.target.value)} /> </div>  
                                </div> 
                                <div class="agp-input">
                                    <div class="number-student"> Chamada: </div>  
                                    <div class="input"> <input type="text" value={chamada} onChange={e => setChamada(e.target.value)} /> </div> 
                                </div>
                            </div>

                            <div class="input-right">
                                <div class="agp-input">
                                    <div class="corse-student"> Curso: </div>  
                                    <div class="input"> <input type="text" value={curso} onChange={e => setCurso(e.target.value)} /> </div>  
                                </div>
                                <div class="agp-input">
                                    <div class="class-student"> Turma: </div>  
                                    <div class="input"> <input type="text" value={turma} onChange={e => setTurma(e.target.value)} /> </div> 
                                </div>
                            </div>
                            <div class="button-create"> <button onClick={inserir}> {idAlterando == 0 ? "Cadastrar" : "Alterar"} </button> </div>
                        </div>
                    </div>

                    <div class="student-registered-box">
                        <div class="row-bar"> 
                            <div class="bar-new-student"> </div>
                            <div class="text-registered-student"> Alunos Matriculados </div>
                        </div>
                    
                        <table class ="table-user">
                            <thead>
                                <tr>
                                    <th> ID </th>
                                    <th> Nome </th>
                                    <th> Chamada </th>
                                    <th> Turma </th>
                                    <th> Curso </th>
                                    <th class="coluna-acao"> </th>
                                    <th class="coluna-acao"> </th>
                                </tr>
                            </thead>
                    
                            <tbody>

                                {alunos.map((item, i) =>

                                     <tr className={i % 2 == 0 ? "linha-alternada" : ""}>
                                        <td> {item.id_matricula} </td>
                                        <td title={item.nm_aluno}> {item.nm_aluno != null && item.nm_aluno.length >= 25 ? item.nm_aluno.substr(0, 25) + '...' : item.nm_aluno}</td>
                                        <td> {item.nr_chamada} </td>
                                        <td> {item.nm_turma} </td>
                                        <td> {item.nm_curso} </td>
                                        <td className="coluna-acao"> <button onClick={() => editar(item)}> <img src="/assets/images/edit.svg" alt="" /> </button> </td>
                                        <td className="coluna-acao"> <button onClick={() => remover(item.id_matricula) }> <img src="/assets/images/trash.svg" alt="" /> </button> </td>
                                    </tr>
                                )}                            
                            
                            </tbody> 
                        </table>
                    </div>
                </div>
            </Conteudo>
        </Container>
    )
}
