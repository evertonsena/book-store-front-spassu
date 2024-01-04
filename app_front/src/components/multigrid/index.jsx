// @flow
import Moment from "moment";
import "moment/locale/pt-br";
import {
  Form,
  Badge,
  Row,
  Col,
  FormGroup,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardFooter,
} from "reactstrap";
import Api from "../../services/Api";
import React, { Component } from "react";
import PropTypes from "prop-types";
import MUIDataTable from "mui-datatables";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import CloseIcon from "@material-ui/icons/Close";
import {
  LinearProgress,
  Switch,
  Tooltip,
  IconButton,
  Slide,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  TextField,
  FormControlLabel,
  Select,
  FormControl,
  MenuItem,
  OutlinedInput,
  InputLabel,
  CircularProgress,
  Chip,
} from "@material-ui/core";
import Swal from "sweetalert2";
import "./style.css";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SelectMultiple from "react-select";
import makeAnimated from "react-select/animated";

const animatedComponents = makeAnimated();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));

class MultiGrid extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.instanceOf(Object),
  };

  /**
   * VALORES DEFAULT PARA O COMPONENTE
   */
  static defaultProps = {
    options: {
      filter: true,
      filterType: "dropdown",
      responsive: "stacked",
      rowsPerPage: 10,
      search: true,
      download: true,
      viewColumns: true,
      print: true,
      // selectableRows: 'none',
      modal: {
        marginTop: "120px",
      },
    },
  };

  static API_TYPE = {
    REST: "rest",
    GRAPHQL: "graphql",
  };

  constructor(props) {
    super(props);

    this.state = {
      data: this.props.data,
      title: this.props.title,
      scope: this.props.scope,
      apiType: this.props.apiType || MultiGrid.API_TYPE.REST,
      primary_key: this._getPrimaryField(this.props),
      columns: this._getColumns(this.props),
      translateColumns: this._hasTranslate(this.props),
      events: this.props.events,
      showLoading: false,
      showModal: false,
      showLoadingModal: true,
      modal: {
        action: "view",
        title: null,
        data: this._getDataColumns(this.props),
        marginTop:
          this.props.options.modal && this.props.options.modal.marginTop
            ? this.props.options.modal.marginTop
            : MultiGrid.defaultProps.options.modal.marginTop,
      },
      options: {
        filter:
          this.props.options.filter || MultiGrid.defaultProps.options.filter,
        filterType:
          this.props.options.filterType ||
          MultiGrid.defaultProps.options.filterType,
        responsive:
          this.props.options.responsive ||
          MultiGrid.defaultProps.options.responsive,
        rowsPerPage:
          this.props.options.count ||
          MultiGrid.defaultProps.options.rowsPerPage,
        search:
          this.props.options.search || MultiGrid.defaultProps.options.search,
        download:
          this.props.options.download ||
          MultiGrid.defaultProps.options.download,
        viewColumns:
          this.props.options.viewColumns ||
          MultiGrid.defaultProps.options.viewColumns,
        print: this.props.options.print || MultiGrid.defaultProps.options.print,
        selectableRows: this._isMultiselected(this.props),
        textLabels: {
          body: {
            noMatch: this._getNoMatch(this.props),
            toolTip: "Ordenar",
          },
          pagination: {
            next: "Próxima Página",
            previous: "Página Anterior",
            rowsPerPage: "Registros por Página:",
            displayRows: "de",
          },
          toolbar: {
            search: "Pesquisar",
            downloadCsv: "Download CSV",
            print: "Imprimir",
            viewColumns: "Mostrar Colunas",
            filterTable: "Filtrar Tabela",
          },
          filter: {
            all: "Todos",
            title: "FILTROS",
            reset: "LIMPAR",
          },
          viewColumns: {
            title: "Mostrar Colunas",
            titleAria: "Mostrar/Esconder Colunas",
          },
          selectedRows: {
            text: "linhas(s) selecionadas",
            delete: "Apagar",
            deleteAria: "Apagar Linha Selecionada",
          },
        },
        customToolbar: () => {
          const { events } = this.state;

          return (
            <>
              {events &&
              (events.create ||
                (events.graphql &&
                  events.graphql.route &&
                  events.graphql.route.create)) ? (
                <Tooltip
                  title={
                    events.create && events.create.title
                      ? events.create.title
                      : "Novo"
                  }
                >
                  {events.create && events.create.route ? (
                    <IconButton>
                      <Link to={events.create.route}>
                        <AddIcon />
                      </Link>
                    </IconButton>
                  ) : (
                    <IconButton onClick={this.handleOnCreateRecord}>
                      <AddIcon />
                    </IconButton>
                  )}
                </Tooltip>
              ) : (
                ""
              )}
            </>
          );
        },
        /**
         * METODO INVOCADO NA EXCLUSAO DE MULTIPLAS LINHAS
         */
        onRowsDelete: (rowsDeleted) => {
          if (rowsDeleted) {
            Swal.fire({
              type: "warning",
              title: this.state.scope,
              showCancelButton: true,
              confirmButtonText: "Confirmar",
              cancelButtonText: "Cancelar",
              showLoaderOnConfirm: true,
              text: this.state.events.delete.questionMultiple
                ? this.state.events.delete.questionMultiple
                : "Remover registros selecionados?",
              preConfirm: () => {
                let rows = [];
                rowsDeleted.data.forEach((row) => {
                  rows.push(
                    this.state.data[row.dataIndex][this.state.primary_key]
                  );
                });

                return Api.delete(this._getRoute(this.state.events.route), {
                  data: rows,
                });
              },
            }).then((result) => {
              if (result.dismiss !== "cancel") {
                Swal.fire({
                  type: result.value.data.status ? "success" : "error",
                  title: this.state.scope,
                  text: result.value.data.message,
                }).then(() => {
                  if (result.value.data.status) {
                    this.handleLoadList();
                  }
                });
              }
            });
          }
          return false;
        },
      },
    };
  }

  /**
   * ROTINA QUE FAZ A TRADUCAO DOS PARAMETROS ENVIADOS PARA TRANSFORMAR EM COLUNAS
   */
  _getDataColumns = (props) => {
    const { columns } = props;

    if (!columns) {
      return null;
    }

    let dataColumns = {};
    columns.forEach((colum) => {
      if (!(colum.options && colum.options.empty) && colum.name) {
        dataColumns[colum.name] = this._getDefaultValueColumn(
          colum.name,
          props
        );
      }
    });

    return dataColumns;
  };

  /**
   * ROTINA QUE CONFIGURA O VALOR DEFAUL DA CHAVE PRIMARIA, DENTRE OS CAMPOS ENVIADOS NAS COLUNAS
   */
  _getPrimaryField = (props) => {
    const { columns } = props;

    if (columns) {
      let primaryColumn = null;
      columns.forEach((colum) => {
        if (colum.type && colum.type === "primary_key") {
          primaryColumn = colum.name;
        }
      });
      return primaryColumn;
    }
    return null;
  };

  // VERIFICA SE EXISTE COLUNA COM SUBNIVEIS
  _hasTranslate = (props) => {
    const { columns } = props;

    let hasTranslate = [];
    if (columns) {
      columns.forEach((colum) => {
        if (
          typeof colum.translate !== "undefined" &&
          colum.translate.indexOf(".") !== -1
        ) {
          hasTranslate.push(colum.translate);
        }
      });
    }
    return hasTranslate;
  };

  _getDefaultValueColumn = (field, props) => {
    let columns;
    if (props) {
      columns = props.columns;
    } else {
      columns = this.state.columns;
    }

    let value = "";
    columns.some(function (colum) {
      if (colum.name === field) {
        if (colum.default) {
          value = colum.default;
        } else if (colum.type === "boolean") {
          value = false;
        }
        return true;
      }
      return false;
    });

    return value;
  };

  /* FORMATAÇÃO DO VALUE */
  _formatValue = (colum, value) => {
    if (colum.textFirstLetterUp) {
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    if (colum.textAllLettersUp) {
      return value.toUpperCase();
    }

    return value;
  };

  /**
   * ROTINA RESPONSAVEL POR IDENTIFICAR SE TERA A OPCAO DE MULTISELECT
   */
  _isMultiselected = (props) => {
    const { events } = props;

    if (events && events.delete && events.delete.multiple) {
      return "multiple";
    }
    return "none";
  };

  _isSplitProcessOnServer = () => {
    const { events } = this.state;

    if (events && events.splitProcessOnServer) {
      return true;
    }
    return false;
  };

  /**
   * ROTINA RESPONSAVEL POR RETORNAR A MENSAGEM DE NOMATCH
   */
  _getNoMatch = (props) => {
    const { scope } = props;

    if (scope) {
      return `Nenhum(a) ${scope} encontrado(a).`;
    }
    return "Nenhum registro encontrado.";
  };

  /**
   * ROTINA RESPONSAVEL POR TRADUZIR AS COLUNAS
   */

  _getColumns = (props) => {
    const { columns, events } = props;

    if (!columns) {
      return [];
    }

    // Colunas do tipo Link são apresentados como icone
    let columnsAction = [];
    const newColumns = columns.map((field) => {
      const colum = {
        ..._defaultColum,
        ...field,
        options: {
          ..._defaultColum.options,
          ...field.options,
        },
        visible: {
          ..._defaultColum.visible,
          ...field.visible,
        },
        select: {
          ..._defaultColum.select,
          ...field.select,
        },
      };

      // CASO NAO EXISTA O NAME, PEGA O DEFAULT
      if (typeof colum.name === "undefined") {
        colum.name = "";
      }

      // CASO NAO EXISTA O LABEL, PEGA O NOME DA COLUNA E A CAPITALIZA
      if (!colum.label && colum.name) {
        colum.label = colum.name.charAt(0).toUpperCase() + colum.name.slice(1);
      }

      if (typeof colum.translate !== "undefined") {
        colum.originalName = colum.name;
        colum.name = colum.translate;
      }

      // VERIFICA SE EH PRA MOSTRAR OU NAO A COLUNA NA ACTION DO LIST
      if (colum.visible && typeof colum.visible.list !== "undefined") {
        colum.options.display = colum.visible.list;
      }

      // DE ACORDO COM O TIPO, PROGRAMA A COLUNA DENTRO DO GRID
      if (colum.type) {
        switch (colum.type) {
          case "primary_key":
            colum.options.filter = false;
            colum.options.viewColumns = false;
            colum.options.display = colum.options.display
              ? colum.options.display
              : false;
            break;

          case "date":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              return Moment(value).format("L");
            };
            break;

          case "time":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              return value ? value.substring(0, 5) : "";
            };
            break;

          case "datetime":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              return Moment(value).format("L HH:mm");
            };
            break;

          case "boolean":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              return <Switch color="primary" checked={value} />;
            };
            break;

          case "badge":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              if (typeof value == "boolean") {
                value = value ? "true" : "false";
              }

              // ANALISANDO O TIPO
              let tipo;
              if (typeof colum.badge.type == "object") {
                tipo = colum.badge.type[value];
              } else if (colum.badge.type) {
                tipo = colum.badge.type;
              } else {
                tipo = "success";
              }

              return (
                <Badge color={tipo} style={{ fontSize: "17px" }}>
                  {colum.badge.value[value] ? colum.badge.value[value] : ""}
                </Badge>
              );
            };
            break;
          case "chip":
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              if (typeof value == "boolean") {
                value = value ? "true" : "false";
              }

              let style = "default",
                size = "small",
                color = "default",
                backgroundColor = "",
                borderColor = "",
                fontColor = "";

              if (colum.chip) {
                if (colum.chip.style) {
                  style = colum.chip.style;
                }

                if (colum.chip.size) {
                  size = colum.chip.size;
                }

                if (colum.chip.color) {
                  color = colum.chip.color;
                }

                if (colum.chip.colors && colum.chip.colors[value]) {
                  if (style === "outlined") {
                    borderColor = colum.chip.colors[value];
                    fontColor = borderColor;
                  } else {
                    backgroundColor = colum.chip.colors[value];
                    fontColor = "#fff";
                  }
                }
              }

              return (
                <Chip
                  variant={style}
                  size={size}
                  color={color}
                  label={this._formatValue(colum, value)}
                  style={{ backgroundColor, borderColor, color: fontColor }}
                />
              );
            };
            break;

          case "link":
            colum.options.filter = false;
            colum.options.viewColumns = false;
            colum.options.display = false;
            colum.visible.create = false;
            colum.visible.update = false;
            columnsAction.push({
              title: colum.link.title,
              route: colum.link.route,
              icon: "icon-" + colum.link.icon + " icons",
            });
            break;

          // CASO NAO SEJA DE NENHUM TIPO MAPEADO, FORCA MOSTRA-LO COMO STRING (BUG DO GRID QUANDO EH DO TIPO BOOLEAN)
          default:
            colum.options.customBodyRender = (
              value,
              tableMeta,
              updateValue
            ) => {
              if (colum.limit_text) {
                return this._wrapText(String(value), colum.limit_text, true);
              }

              return String(value);
            };
            break;
        }
      } else {
        colum.options.customBodyRender = (value, tableMeta, updateValue) => {
          if (colum.tooltip) {
            return (
              <Tooltip title={this._getColumnToolTip(tableMeta, colum.tooltip)}>
                <span>{value}</span>
              </Tooltip>
            );
          } else {
            if (colum.limit_text) {
              return this._wrapText(String(value), colum.limit_text, true);
            }
            return String(value);
          }
        };
      }
      return colum;
    });

    if (
      (events &&
        (events.update ||
          events.delete ||
          (events.graphql &&
            (events.graphql.route.update || events.graphql.route.delete)))) ||
      columnsAction.length > 0
    ) {
      let comp = {
        name: "",
        options: {
          empty: true,
          filter: false,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <>
                {columnsAction.map((item, index) => {
                  return (
                    <Tooltip key={index} title={item.title}>
                      <IconButton>
                        <Link
                          to={this._parseRoute(
                            item.route,
                            this._getColumnAndValue(tableMeta.rowData)
                          )}
                        >
                          <i className={item.icon}></i>
                        </Link>
                      </IconButton>
                    </Tooltip>
                  );
                })}
                {events.update || events.graphql.route.update ? (
                  <Tooltip
                    title={
                      events.update && events.update.title
                        ? events.update.title
                        : "Alterar"
                    }
                  >
                    <IconButton
                      onClick={() => {
                        this.handleOnUpdateRecord(tableMeta);
                      }}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
                {events.delete || events.graphql.route.delete ? (
                  <Tooltip
                    title={
                      events.delete && events.delete.title
                        ? events.delete.title
                        : "Apagar"
                    }
                  >
                    <IconButton
                      onClick={() => {
                        this.handleOnDeleteRecord(tableMeta);
                      }}
                    >
                      <DeleteIcon color="secondary" />
                    </IconButton>
                  </Tooltip>
                ) : (
                  ""
                )}
              </>
            );
          },
        },
      };
      newColumns.push(comp);
    }
    return newColumns;
  };

  /**
   * Metodo responsavel por realizar o parse da route usando {}
   * @param route
   * @private
   */
  _parseRoute = (route, columnsForName) => {
    if (!columnsForName) {
      return "";
    }

    columnsForName.forEach((column) => {
      let name = "{" + column.name + "}";
      route = route.replace(name, column.value);
    });

    return route;
  };

  /**
   *
   */
  _wrapText = (text, limit, withSuspensionPoints) => {
    if (limit < text.length) {
      return (
        text.slice(0, withSuspensionPoints ? limit - 3 : limit) +
        (withSuspensionPoints ? "..." : "")
      );
    }
    return text;
  };

  /**
   * Metodo responsavel por retorna coluna e seu valor
   * @param rowData
   * @returns {Array<{name: *, value: *}>}
   * @private
   */
  _getColumnAndValue = (rowData) => {
    if (!rowData) {
      return null;
    }
    const { columns } = this.state;

    return columns.map((item, index) => {
      return {
        name: item.name,
        value: rowData[index],
      };
    });
  };

  /**
   * Metodo responsavel por retornar o tooltip da coluna
   * @param tableMeta
   * @returns {Array<{name: *, value: *}>}
   * @private
   */
  _getColumnToolTip = (tableMeta, tooltip) => {
    if (!tableMeta || !tooltip) {
      return null;
    }
    const { data } = this.state;
    const { rowIndex } = tableMeta;

    const tooltips = tooltip.split(".", 2);
    if (tooltips.length === 2) {
      return data[rowIndex][tooltips[0]][tooltips[1]];
    } else {
      return data[rowIndex][tooltips[0]];
    }
  };

  /**
   * METODO RESPONSAVEL POR PADRONIZAR AS ROTAS PASSADAS POR PARAMETRO
   */
  _getRoute = (route) => {
    return route.endsWith("/") ? route : route + "/";
  };

  _toGraphQL = (action, params, id) => {
    const { primary_key, events } = this.state;
    const { route, pagination } = events.graphql;

    let args, script;
    let keys = Object.keys(params);

    switch (action) {
      case "list":
        keys = keys.join(",");
        script = `query{
                    ${route[action]} 
                        ${
                          pagination
                            ? `(page: 1, limit: 255) { data { ${keys} } }`
                            : `{${keys}}`
                        } }`;
        break;
      case "show":
        args = primary_key + ':"' + id + '"';
        script = `query{ ${route[action]}(${args}) { ${keys} } }`;

        break;

      case "create":
        const indexPk = keys.findIndex((key) => key === primary_key);
        if (indexPk >= 0) {
          keys.splice(indexPk, 1);
        }
        args = keys.map((key) => key + ':"' + params[key] + '"').join(",");
        keys = keys.join(",");

        script = `mutation{${route[action]}(${args}) { ${keys} } }`;
        break;
      case "update":
        args = keys.map((key) => key + ':"' + params[key] + '"').join(",");
        keys = keys.join(",");

        script = `mutation{${route[action]}(${args}) { ${keys} } }`;

        break;
      case "delete":
        args = primary_key + ':"' + id + '"';

        script = `mutation{${route[action]}(${args})}`;
        break;

      default:
        break;
    }

    return script;
  };

  /**
   * METODO EXECUTADO AO TERMINAR O CARREGAMENTO DO COMPONENTE
   */
  componentDidMount() {
    this.handleLoadList();
    this.setState({ multipleSelectClasses: useStyles });
  }

  /**
   * METODO RESPONSAVEL POR CARREGAR A LISTA DOS DADOS NO GRID
   */
  handleLoadList = async () => {
    const { events } = this.state;

    if (events && events.route) {
      const { translateColumns, apiType } = this.state;

      this.setState({ showLoading: true });

      const _route = this._getRoute(events.route);

      let response = [],
        splitResponse;

      if (this._isSplitProcessOnServer()) {
        if (events.splitCount != 0) {
          let page = 0,
            per_page = events.splitCount || 100,
            last_page;

          do {
            page++;

            splitResponse = await Api.get(
              `${_route}?page=${page}&per_page=${per_page}`
            );

            if (splitResponse.data.data.data.length == 0) {
              break;
            }

            last_page = splitResponse.data.data.last_page;

            response = response.concat(splitResponse.data.data.data);
          } while (last_page > page);
        }
      } else {
        const { modal } = this.state;
        // GraphQL - Sempre POST e consulta no query
        if (
          apiType === MultiGrid.API_TYPE.GRAPHQL &&
          events.graphql &&
          events.graphql.route &&
          events.graphql.route.list
        ) {
          response = await Api.post(_route, {
            query: this._toGraphQL("list", modal.data),
          });

          if (
            response.data &&
            response.data.data &&
            response.data.data[events.graphql.route.list]
          ) {
            if (
              events.graphql.pagination &&
              response.data.data[events.graphql.route.list].data
            ) {
              response = response.data.data[events.graphql.route.list].data;
            } else {
              response = response.data.data[events.graphql.route.list];
            }
          } else {
            response = [];
          }
        } else {
          response = await Api.get(_route);
          response = events.responseInThirdLevel
            ? response.data.data.data
            : response.data.data;
        }
      }

      if (translateColumns.length) {
        response.forEach((row, index) => {
          translateColumns.forEach((field) => {
            const fields = field.split(".", 2);
            response[index][field] = row[fields[0]][fields[1]];
          });
        });
      }

      this.setState({
        data: response,
        showLoading: false,
      });
    }
  };

  /**
   * METODO RESPONSAVEL POR ABRIR O MODAL
   */
  handleModalOpen = () => {
    this.setState({ showModal: true });
  };

  /**
   * METODO RESPONSAVEL POR FECHAR O MODAL
   */
  handleModalClose = () => {
    this.setState({ showModal: false });
  };

  /**
   * METODO RESPONSAVEL POR TRATAR A INCLUSAO DE NOVOS DADOS
   */
  handleOnCreateRecord = async () => {
    if (this.state.events.create && this.state.events.create.onBefore) {
      this.state.events.create.onBefore();
    }

    const currentState = { ...this.state };
    for (var property in this.state.modal.data) {
      currentState["modal"]["data"][property] =
        this._getDefaultValueColumn(property);
    }

    currentState["modal"]["action"] = "create";
    this.setState({
      ...currentState,
    });

    await this.handleLoadSelects().then(() => {
      this.handleModalOpen();
    });
  };

  /**
   * METODO RESPONSAVEL POR TRATAR A ALTERACAO DE DADOS
   */
  handleOnUpdateRecord = async (tableMeta) => {
    const { primary_key, events, apiType, modal } = this.state;

    if (!primary_key) {
      console.warn("[Multigrid][Update] Não existe campo de chave definido.");
      return false;
    }

    if (this.state.events.update && this.state.events.update.onBefore) {
      this.state.events.update.onBefore();
    }

    const { rowIndex } = tableMeta;
    const id = this.state.data[rowIndex][primary_key];

    let response;

    // GraphQL - Sempre POST e consulta no query
    if (apiType === MultiGrid.API_TYPE.GRAPHQL && events.graphql.route.show) {
      response = await Api.post(this._getRoute(events.route), {
        query: this._toGraphQL("show", modal.data, id),
      });

      if (
        response.data &&
        response.data.data &&
        response.data.data[events.graphql.route.show]
      ) {
        response = response.data.data[events.graphql.route.show];
      } else {
        response = [];
      }
    } else {
      const route = events.update.customRoute
        ? events.update.customRoute
        : this.state.events.route;
      response = await Api.get(this._getRoute(route) + id);

      if (typeof response === "undefined") {
        Swal.fire("Erro", "Erro na obtenção dos dados.", "error");
        return false;
      }

      if (response.data && events.responseInThirdLevel) {
        response = response.data;
      }

      response = response.data.data;
    }

    // console.log(response);

    const currentState = await { ...this.state };

    for (var property in this.state.modal.data) {
      currentState["modal"]["data"][property] = response[property];
    }

    currentState["modal"]["action"] = "update";
    this.setState({
      ...currentState,
    });

    await this.handleLoadSelects().then(() => {
      this.handleModalOpen();
    });
  };

  /**
   * METODO RESPONSAVEL POR TRATAR A EXCLUSAO DE DADOS DE UMA LINHA
   */
  handleOnDeleteRecord = async (tableMeta) => {
    const { scope, events, primary_key, apiType, modal } = this.state;

    if (events.delete && events.delete.onBefore) {
      events.delete.onBefore();
    }

    const { rowIndex } = tableMeta;

    let message = await Swal.fire({
      type: "warning",
      title: this.state.scope,
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      text:
        events.delete && events.delete.question
          ? events.delete.question
          : "Remover " + scope + "?",
    });

    if (message.value) {
      const id = this.state.data[rowIndex][primary_key];
      let response;

      if (
        apiType === MultiGrid.API_TYPE.GRAPHQL &&
        events.graphql &&
        events.graphql.route &&
        events.graphql.route.delete
      ) {
        response = await Api.post(this._getRoute(events.route), {
          query: this._toGraphQL("delete", modal.data, id),
        });

        const resp = response.data.data[events.graphql.route.delete];

        message = await Swal.fire({
          type: resp ? "success" : "error",
          text: resp,
        });

        if (message.value) {
          this.handleModalClose();
          this.handleLoadList();
        }
      } else {
        response = await Api.delete(this._getRoute(events.route) + id);

        message = await Swal.fire({
          type: response.data.status ? "success" : "error",
          html: this.getMessageResponse(response.data),
        });

        if (message.value) {
          this.handleModalClose();
          this.handleLoadList();
        }
      }
    }
  };

  /**
   * METODO RESPOSNAVEL POR CARREGAR OS SELECTS QUANDO VEEM DE ROTAS
   */
  handleLoadSelects = async () => {
    const { columns, modal } = this.state;

    if (!columns) {
      return false;
    }

    /**
     * TODO: Contornando o falha do await/async das API's para os selects
     */
    let amountRequestForSelects = 0;
    columns.forEach((column) => {
      if (
          (column.type === "select" || column.type === "multiple-select") &&
        typeof column.select.route !== "undefined" &&
        column.select.autoload === true
      ) {
        amountRequestForSelects++;
      }
    });

    if (amountRequestForSelects < 1) {
      this.setState({ showLoadingModal: false });
      return false;
    }

    this.setState({ showLoadingModal: true });

    let amountRequestForSelectsCompleted = 0,
      selfThis = this;

    /**
     * TODO: Fim do contorno
     */

    await columns.forEach(async (colum) => {
      if (
          (colum.type === "select" || colum.type === "multiple-select") &&
        typeof colum.select.route !== "undefined"
      ) {
        if (typeof colum.select.value === "undefined") {
          console.warn(
            "[Multigrid][Select] Não existe campo de value definido para o select."
          );
          return false;
        }

        /* 
            No update, caso o select tenha Children:
            1) Necessário popular automaticamente o children.
            2) Como o valor está no state, automaticamente o campo será selecionado
        */

        if (modal.action === "update" && colum.select.children !== undefined) {
          this._handleChildren(colum.name);
        }

        // CASO NAO EXISTA LABEL, SOBRESCREVE COM O VALUE
        if (typeof colum.select.label === "undefined") {
          colum.select.label = colum.select.value;
        }

        if (typeof colum.select.items === "undefined") {
          if (!colum.select.autoload) {
            colum.select["items"] = [];
            return;
          }
          const route = this._getRoute(colum.select.route);
          const response = await Api.get(route);

          if (response.data.data !== undefined) {
            const items = response.data.data.map((item) => {
              return {
                label: item[colum.select.label],
                value: item[colum.select.value],
              };
            });

            colum.select["items"] = items;

            /**
             * TODO: Contornando o falha do await/async das API's para os selects
             */
            amountRequestForSelectsCompleted++;

            if (amountRequestForSelects === amountRequestForSelectsCompleted) {
              selfThis.setState({ showLoadingModal: false });
            }
            /**
             * TODO: Fim do contorno
             */
          }
        } else {
          selfThis.setState({ showLoadingModal: false });
        }
      }
    });
  };

  /**
   * METODO RESPONSAVEL POR ENVIAR OS DADOS DE INCLUSAO E ALTERACAO
   */
  handleSubmit = async (e) => {
    e.preventDefault();

    const { modal, primary_key, apiType, events } = this.state;

    let response;

    if (apiType === MultiGrid.API_TYPE.GRAPHQL) {
      response = await Api.post(this._getRoute(events.route), {
        query: this._toGraphQL(modal.action, modal.data),
      });

      if (
        response.data &&
        response.data.data &&
        response.data.data[events.graphql.route[modal.action]]
      ) {
        Swal.fire({
          type: "success",
          html: "Dados gravados com sucesso",
        }).then(() => {
          this.handleModalClose();
          this.handleLoadList();
        });
      } else {
        Swal.fire({
          type: "error",
          html: "Erro ao gravar o registro",
        });
      }
    } else {
      switch (modal.action) {
        case "create":
          response = await Api.post(
            this._getRoute(this.state.events.route),
            this.state.modal.data
          );
          break;

        case "update":
          const id = modal.data[primary_key];
          response = await Api.put(
            this._getRoute(this.state.events.route) + id,
            this.state.modal.data
          );
          break;

        default:
          break;
      }
      Swal.fire({
        type: response.data.status,
        html: this.getMessageResponse(response.data)
      });
      if (response.data.status == 'success') {
        this.handleModalClose();
        this.handleLoadList();
      }
    }
    // */
  };

  _handleChildren = async (name, changing) => {
    const { columns, modal } = this.state;
    const columnFather = columns.filter((item) => {
      return (
        item.name === name &&
        typeof item.select.children !== "undefined" &&
        item.select.children.length > 0
      );
    });
    if (columnFather.length === 0) {
      return;
    }
    let columnsChildren = {},
      indexColumn;
    columnFather[0].select.children.forEach((children) => {
      columnsChildren = columns.filter((item, index) => {
        if (item.name === children) {
          indexColumn = index;
          return true;
        }
        return false;
      });
    });
    columnsChildren.forEach(async (column) => {
      const route = this._getRoute(
        this._parseRoute(column.select.route, [
          { name, value: modal.data[name] },
        ])
      );
      const response = await Api.get(route);
      if (response.data.data !== undefined) {
        const items = response.data.data.map((item) => {
          return {
            label: item[column.select.label],
            value: item[column.select.value],
          };
        });

        columns[indexColumn].select["items"] = items;
        columns[indexColumn].select["parent"] = name;

        if (
          modal.action !== "update" ||
          (changing !== undefined && changing === "changing")
        ) {
          modal.data[column.name] = "";

          if (column.select.children !== undefined) {
            column.select.children.forEach((col) => {
              modal.data[col] = "";
            });
          }
        }

        this.setState({ columns, modal });
      }
    });
  };

  /**
   * METODO INVOCADO QUANDO HA ALTERACAO DE DADOS
   */
  handleFieldChange = (name) => (e) => {
    // e.preventDefault()

    let value;
    if (typeof e.target !== "undefined") {
      let { checked, type } = e.target;
      value = e.target.value;

      if (type === "checkbox") {
        value = checked;
      }
    } else {
      // VERIFICA SE TEM O CAMPO DE VALOR DEFINIDO
      if (typeof e.value !== "undefined") {
        value = e.value;
      }
    }

    const currentState = { ...this.state };
    currentState["modal"]["data"][name] = value;

    this.setState(currentState);

    this._handleChildren(name, "changing");
  };

  /**
   * METODO INVOCADO QUANDO HA ALTERACAO DE DADOS NO SELECT MULTIPLE
   */
  handleFieldChangeMultiple = (name) => (e) => {
    const currentState = { ...this.state };
    currentState["modal"]["data"][name] = e;
    this.setState(currentState);
  };

  getMessageResponse = response => {
    let message = '';
    if(
        !response.status &&
        response.errors &&
        typeof response.errors === 'object'
    ) {
      for (const error of Object.values(response.errors)) { // for boladao
        message += error.join() + '<br>';
      }
    } else {
      message = response.message;
    }

    return message;
  };

  render() {
    const {
      data,
      title,
      options,
      columns,
      showLoading,
      showModal,
      events,
      modal,
      showLoadingModal,
    } = this.state;

    const fields = columns.map(function (colum, idx) {
      if (colum.options && colum.options.empty) {
        return false;
      }

      if (colum.visible) {
        if (
          modal.action === "create" &&
          typeof colum.visible.create !== "undefined" &&
          !colum.visible.create
        ) {
          return false;
        }
        if (
          modal.action === "update" &&
          typeof colum.visible.update !== "undefined" &&
          !colum.visible.update
        ) {
          return false;
        }
      }

      let columnName = colum.name;
      if (colum.originalName !== null) {
        columnName = colum.originalName;
      }

      let component;
      switch (colum.type) {
        case "primary_key":
          component = (
            <Input
              type="hidden"
              name={columnName}
              value={modal.action === "update" ? modal.data[columnName] : ""}
            />
          );
          break;

        case "boolean":
          component = (
            <FormControlLabel
              label={colum.label}
              variant="outlined"
              control={
                <Switch
                  color="primary"
                  checked={modal.data[columnName]}
                  onChange={this.handleFieldChange(columnName)}
                />
              }
            />
          );
          break;

        case "select":
          component = (
            <>
              <FormControl
                variant="outlined"
                style={{ marginTop: "1em", width: "100%" }}
              >
                <InputLabel htmlFor="outlined-simple-">
                  {colum.label}
                </InputLabel>
                <Select
                  name={columnName}
                  value={modal.data[columnName] ? modal.data[columnName] : ""} //(valueSelectChildren && valueSelectChildren !== undefined) ? valueSelectChildren : ''}
                  onChange={this.handleFieldChange(columnName)}
                  required={colum.options.required ? true : false}
                  input={
                    <OutlinedInput
                      labelWidth={10}
                      name={columnName}
                      id="outlined-simple-"
                    />
                  }
                >
                  <MenuItem>
                    <em>Selecione...</em>
                  </MenuItem>
                  {/* se nao existe pai, se existe pai e o pai nao estiver vazio
                                    se coluna possui itens, map */}
                  {(colum.select.parent === undefined ||
                    (colum.select.parent !== undefined &&
                      modal.data[colum.select.parent] !== "")) &&
                    colum.select.items &&
                    colum.select.items.map((item, key) => (
                      <MenuItem key={key} value={item.value}>
                        {item.label}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </>
          );
          break;

        case "multiple-select":
          component = (
            <>
              <FormControl
                variant="outlined"
                style={{ marginTop: "1em", width: "100%", zIndex: "1000" }}
              >
                <SelectMultiple
                  placeholder={colum.label}
                  isSearchable={true}
                  // isClearable={true}
                  isMulti={true}
                  name={columnName}
                  required={true}
                  components={animatedComponents}
                  options={colum.select.items}
                  value={modal.data[columnName]}
                  closeMenuOnSelect={false}
                  noOptionsMessage={() => "Sem mais registros."}
                  isDisabled={false}
                  onChange={this.handleFieldChangeMultiple(columnName)}
                />
              </FormControl>
            </>
          );
          break;

        default:
          component = (
            <TextField
              InputLabelProps={{ shrink: true }}
              type={colum.type ? colum.type : "text"}
              label={colum.label}
              name={columnName}
              value={modal.data[colum.name]}
              onChange={this.handleFieldChange(columnName)}
              required={colum.options.required ? true : false}
              className="form-control"
              margin="normal"
              variant="outlined"
              placeholder={colum.placeholder}
              maxLength={colum.maxLength}
              minLength={colum.minLength}
            />
          );
          break;
      }

      return (
        <Row key={idx}>
          <Col>
            <FormGroup>{component}</FormGroup>
          </Col>
        </Row>
      );
    }, this);

    return (
      <>
        {showLoading && <LinearProgress />}
        <MUIDataTable
          title={title}
          data={data}
          columns={columns}
          options={options}
        />

        <Dialog
          open={showModal}
          onClose={this.handleClose}
          fullScreen
          TransitionComponent={Transition}
          style={{ marginTop: `${modal.marginTop}` }}
        >
          {showLoadingModal ? (
            <CircularProgress style={{ marginLeft: "50%" }} />
          ) : (
            <Form onSubmit={this.handleSubmit}>
              <AppBar position="static">
                <Toolbar>
                  <Tooltip title="Fechar">
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={this.handleModalClose}
                      aria-label="Fechar"
                    >
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>

                  <Typography>{this.state.scope}</Typography>

                  <Button
                    color="inherit"
                    style={{ marginLeft: "85%" }}
                    onClick={this.handleModalClose}
                    aria-label="Fechar"
                  >
                    Fechar
                  </Button>
                </Toolbar>
              </AppBar>
              <DialogContent style={{ marginTop: "15px" }}>
                <Row>
                  <Col
                    sm={{ size: 8, offset: 2 }}
                    md={{ size: 4, offset: 4 }}
                    xs={{ size: 12, offset: 0 }}
                  >
                    <Paper>
                      <Card>
                        <CardHeader>
                          <CardTitle>
                            #{" "}
                            {modal.action === "create" &&
                            events.create &&
                            events.create.title
                              ? events.create.title
                              : (modal.action === "update" &&
                                events.update &&
                                events.update.title
                                  ? events.update.title
                                  : "") +
                                (events.update &&
                                events.update.titleField &&
                                modal.data[events.update.titleField]
                                  ? " (" +
                                    modal.data[events.update.titleField] +
                                    ")"
                                  : "")}
                          </CardTitle>
                        </CardHeader>
                        <CardBody>{fields}</CardBody>
                        <CardFooter>
                          <Button
                            color="primary"
                            type="submit"
                            style={{ float: "right" }}
                          >
                            Gravar
                          </Button>
                        </CardFooter>
                      </Card>
                    </Paper>
                  </Col>
                </Row>
              </DialogContent>
            </Form>
          )}
        </Dialog>
      </>
    );
  }
}

/**
 * VALORES DEFAULT PARA O COMPONENTE
 */
// MultiGrid.defaultProps = {
//     options : {
//         filter: true,
//         filterType: 'dropdown',
//         responsive: 'stacked',
//         rowsPerPage: 10,
//         search: true,
//         download: true,
//         viewColumns: true,
//         print: true,
//         selectableRows: 'none',
//     }
// }

/**
 * METODO DE TRANSICAO DO MODAL
 */
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * VALOR DEFAULT PARA CADA COLUNA DO GRID
 */
const _defaultColum = {
  options: {
    filter: true,
    required: true,
  },
  visible: {
    list: true,
    create: true,
    update: true,
  },
  originalName: null,
  select: {
    autoload: true,
  },
};

export default MultiGrid;
