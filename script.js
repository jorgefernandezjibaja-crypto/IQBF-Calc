// =====================================================
// IQBF-Calc
// Calculadora de requerimiento de IQBF
// OG-IQBF - UNIFSLB
// Version 1.0 - 2026
// =====================================================

const $ = id => document.getElementById(id);

// BASE DE DATOS DE INSUMOS QUIMICOS

const insumos = {
    acetona: {
        nombre: "Acetona",
        estado: "Liquido",
        pureza: 99.98,
        densidad: 0.79,
        masaMolar: 58.08,
        factor: null
    },

    hcl: {
        nombre: "Acido clorhidrico",
        estado: "Liquido",
        pureza: 37,
        densidad: 1.19,
        masaMolar: 36.46,
        factor: 1
    },

    hno3: {
        nombre: "Acido nitrico",
        estado: "Liquido",
        pureza: 65.29,
        densidad: 1.41,
        masaMolar: 63.01,
        factor: 1
    },

    h2so4: {
        nombre: "Acido sulfurico",
        estado: "Liquido",
        pureza: 96.4,
        densidad: 1.84,
        masaMolar: 98.08,
        factor: 2
    },

    amoniaco: {
        nombre: "Amoniaco (NH3)",
        estado: "Liquido",
        pureza: 29.5,
        densidad: 0.89,
        masaMolar: 17.031,
        factor: 1
    },

    na2co3: {
        nombre: "Carbonato de sodio",
        estado: "Solido",
        pureza: 99.7,
        densidad: null,
        masaMolar: 105.99,
        factor: 2
    },

    nh4cl: {
        nombre: "Cloruro de amonio",
        estado: "Solido",
        pureza: 99.8,
        densidad: null,
        masaMolar: 53.49,
        factor: 1
    },

    eter: {
        nombre: "Eter etilico",
        estado: "Liquido",
        pureza: 99.9,
        densidad: 0.715,
        masaMolar: 74.12,
        factor: null
    },

    kmno4: {
        nombre: "Permanganato de potasio",
        estado: "Solido",
        pureza: 99,
        densidad: null,
        masaMolar: 158.034,
        factor: null
    },

    naoh: {
        nombre: "Hidroxido de sodio",
        estado: "Solido",
        pureza: 98.5,
        densidad: null,
        masaMolar: 40.00,
        factor: 1
    },

    benceno: {
        nombre: "Benceno",
        estado: "Liquido",
        pureza: 99,
        densidad: 0.88,
        masaMolar: 78.11,
        factor: null
    },

    cacl2: {
        nombre: "Cloruro de calcio anhidro",
        estado: "Solido",
        pureza: 99,
        densidad: null,
        masaMolar: 110.98,
        factor: 2
    }
};


// FUNCIONES GENERALES


function numero(id) {
    const elemento = $(id);

    if (!elemento) return NaN;

    let valor;

    if (
        elemento.tagName === "INPUT" ||
        elemento.tagName === "SELECT" ||
        elemento.tagName === "TEXTAREA"
    ) {
        valor = elemento.value;
    } else {
        valor = elemento.textContent;
    }

    valor = String(valor)
        .trim()
        .replace(",", ".")
        .replace("%", "")
        .trim();

    return valor === "" ? NaN : Number(valor);
}


function formato(valor) {
    if (valor === null || !Number.isFinite(valor)) {
        return "No aplica";
    }

    return Number(valor.toFixed(8)).toString();
}

function escribir(id, valor) {
    const elemento = $(id);

    if (!elemento) return;

    if (
        elemento.tagName === "INPUT" ||
        elemento.tagName === "SELECT" ||
        elemento.tagName === "TEXTAREA"
    ) {
        elemento.value = valor;
    } else {
        elemento.textContent = valor;
    }
}

function mostrarMensaje(texto) {
    escribir("mensaje", texto);
}

function borrarResultados() {
    [
        "resultadoML",
        "resultadoL",
        "resultadoGotas",
        "resultadoG",
        "resultadoKG",
        "formula",
        "detalle"
    ].forEach(id => escribir(id, "—"));
}


// CARGAR PROPIEDADES DEL INSUMO

function cargarInsumo() {

    const datos = insumos[$("insumo").value];

    borrarResultados();

    if (!datos) return;

    escribir("presentacion", datos.estado);
    escribir("pureza", datos.pureza);
    escribir("densidad", datos.densidad ?? "");
    escribir("masaMolar", datos.masaMolar);
    escribir("factorEquivalencia", datos.factor ?? "");

    actualizarConcentracion();

    mostrarMensaje(
        "Insumo seleccionado: " + datos.nombre
    );
}


// CALCULO DE CONCENTRACION EXISTENTE

function actualizarConcentracion() {

    const datos = insumos[$("insumo").value];

    if (!datos) return;

    const pureza = numero("pureza");
    const densidad = numero("densidad");
    const masaMolar = numero("masaMolar");
    const factor = numero("factorEquivalencia");
    const tipo = $("tipoCalculo").value;

    let pesoEquivalente = null;
    let concentracionExistente = null;

    if (factor > 0 && masaMolar > 0) {
        pesoEquivalente = masaMolar / factor;
    }

    escribir(
        "pesoEquivalente",
        formato(pesoEquivalente)
    );

    if (
        datos.estado === "Liquido" &&
        densidad > 0 &&
        pureza > 0 &&
        masaMolar > 0
    ) {

        const molaridad =
            (pureza / 100) *
            densidad * 1000 / masaMolar;

        if (tipo === "molaridad") {
            concentracionExistente = molaridad;
        }

        if (tipo === "normalidad" && factor > 0) {
            concentracionExistente =
                molaridad * factor;
        }

        if (tipo === "porcentajePV") {
            concentracionExistente =
                pureza * densidad;
        }
    }

    if (tipo === "porcentajePP") {
        concentracionExistente = pureza;
    }

    escribir(
        "concentracionExistente",
        formato(concentracionExistente)
    );
}


// CONVERSION DE UNIDADES

function volumenEnML(cantidad, unidad, gotasML) {

    switch (unidad) {

        case "ml":
            return cantidad;

        case "l":
            return cantidad * 1000;

        case "gotas":
            return cantidad / gotasML;

        default:
            throw new Error(
                "Seleccione mL, L o gotas."
            );
    }
}

function masaEnGramos(cantidad, unidad) {

    switch (unidad) {

        case "g":
            return cantidad;

        case "kg":
            return cantidad * 1000;

        default:
            throw new Error(
                "Seleccione g o kg."
            );
    }
}


// FUNCION PRINCIPAL DE CALCULO

function calcularIQBF() {

    borrarResultados();

    try {

        const datos = insumos[$("insumo").value];

        if (!datos) {
            throw new Error(
                "Seleccione un insumo quimico."
            );
        }

        const tipo = $("tipoCalculo").value;
        const pureza = numero("pureza");
        const densidad = numero("densidad");
        const masaMolar = numero("masaMolar");
        const factor = numero("factorEquivalencia");
        const concentracion = numero("concentracion");
        const cantidad = numero("volumen");
        const unidad = $("unidadVolumen").value;
        const gotasML = numero("factorGotas");

        const liquido = datos.estado === "Liquido";

        let masa = null;
        let volumen = null;
        let formula = "";
        let detalle = "";

        if (!(cantidad > 0)) {
            throw new Error(
                "Ingrese una cantidad mayor que cero."
            );
        }

        if (!(pureza > 0 && pureza <= 100)) {
            throw new Error(
                "La pureza debe estar entre 0 y 100 %."
            );
        }

        if (liquido && !(densidad > 0)) {
            throw new Error(
                "Ingrese una densidad valida."
            );
        }

        if (
            unidad === "gotas" &&
            !(gotasML > 0)
        ) {
            throw new Error(
                "Ingrese el factor de gotas por mL."
            );
        }

        if (
            tipo !== "conversion" &&
            !(concentracion > 0)
        ) {
            throw new Error(
                "Ingrese la concentracion requerida."
            );
        }


        // CONVERSION DIRECTA

        if (tipo === "conversion") {

            if (unidad === "g" || unidad === "kg") {

                masa = masaEnGramos(
                    cantidad, unidad
                );

                if (liquido) {
                    volumen = masa / densidad;
                }

            } else {

                if (!liquido) {
                    throw new Error(
                        "Para solidos utilice g o kg."
                    );
                }

                volumen = volumenEnML(
                    cantidad, unidad, gotasML
                );

                masa = volumen * densidad;
            }

            formula = "m = V × densidad";

            detalle =
                "Conversion directa de " +
                cantidad + " " + unidad;
        }


        // NORMALIDAD Y MOLARIDAD

        else if (
            tipo === "normalidad" ||
            tipo === "molaridad"
        ) {

            const volumenFinal = volumenEnML(
                cantidad, unidad, gotasML
            );

            if (!(masaMolar > 0)) {
                throw new Error(
                    "La masa molar no es valida."
                );
            }

            let peso = masaMolar;

            if (tipo === "normalidad") {

                if (!(factor > 0)) {
                    throw new Error(
                        "Defina el factor de equivalencia " +
                        "segun la reaccion quimica."
                    );
                }

                peso = masaMolar / factor;
            }

            if (liquido) {

                const existente =
                    (pureza / 100) *
                    densidad * 1000 / peso;

                if (concentracion > existente) {
                    throw new Error(
                        "La concentracion solicitada " +
                        "supera la concentracion existente."
                    );
                }

                volumen =
                    concentracion *
                    volumenFinal / existente;

                masa = volumen * densidad;

                formula =
                    tipo === "normalidad"
                    ? "V1 = (N2 × V2) / N1"
                    : "V1 = (M2 × V2) / M1";

                detalle =
                    "Concentracion existente: " +
                    formato(existente) +
                    ". Volumen final: " +
                    formato(volumenFinal) +
                    " mL. Volumen requerido: " +
                    formato(volumen) + " mL.";

            } else {

                masa =
                    concentracion *
                    (volumenFinal / 1000) *
                    peso / (pureza / 100);

                formula =
                    tipo === "normalidad"
                    ? "m = (N × V(L) × PE) / (P/100)"
                    : "m = (M × V(L) × MM) / (P/100)";

                detalle =
                    "Volumen final: " +
                    formato(volumenFinal) +
                    " mL. Masa corregida por pureza: " +
                    formato(masa) + " g.";
            }
        }


        // PORCENTAJE PESO / VOLUMEN

        else if (tipo === "porcentajePV") {

            const volumenFinal = volumenEnML(
                cantidad, unidad, gotasML
            );

            masa =
                concentracion *
                volumenFinal / pureza;

            if (liquido) {

                if (concentracion > pureza * densidad) {
                    throw new Error(
                        "La concentracion requerida " +
                        "supera la existente."
                    );
                }

                volumen = masa / densidad;
            }

            formula =
                "m = (% p/v × V(mL)) / Pureza(%)";

            detalle =
                "Masa del reactivo comercial: " +
                formato(masa) + " g.";
        }


        // PORCENTAJE VOLUMEN / VOLUMEN

        else if (tipo === "porcentajeVV") {

            if (!liquido) {
                throw new Error(
                    "El porcentaje v/v requiere " +
                    "un insumo liquido."
                );
            }

            if (concentracion > 100) {
                throw new Error(
                    "El porcentaje no puede superar 100."
                );
            }

            const volumenFinal = volumenEnML(
                cantidad, unidad, gotasML
            );

            volumen =
                concentracion *
                volumenFinal / 100;

            masa = volumen * densidad;

            formula =
                "V1 = (% v/v × Vfinal) / 100";

            detalle =
                "Porcentaje referido al volumen " +
                "del reactivo comercial. " +
                "No equivale a un porcentaje de " +
                "sustancia pura corregido por pureza.";
        }


        // PORCENTAJE PESO / PESO

        else if (tipo === "porcentajePP") {

            const masaFinal = masaEnGramos(
                cantidad, unidad
            );

            if (concentracion > pureza) {
                throw new Error(
                    "La concentracion solicitada " +
                    "supera la pureza existente."
                );
            }

            masa =
                concentracion *
                masaFinal / pureza;

            if (liquido) {
                volumen = masa / densidad;
            }

            formula =
                "m1 = (% requerido × masa final) / Pureza";

            detalle =
                "Masa final de la preparacion: " +
                formato(masaFinal) +
                " g. Reactivo comercial: " +
                formato(masa) + " g.";
        }

        else {
            throw new Error(
                "Seleccione un tipo de calculo."
            );
        }


        // PRESENTACION DE RESULTADOS

        escribir(
            "resultadoML",
            formato(volumen)
        );

        escribir(
            "resultadoL",
            volumen !== null
            ? formato(volumen / 1000)
            : "No aplica"
        );

        escribir(
            "resultadoGotas",
            volumen !== null && gotasML > 0
            ? formato(volumen * gotasML)
            : "No aplica"
        );

        escribir(
            "resultadoG",
            formato(masa)
        );

        escribir(
            "resultadoKG",
            masa !== null
            ? formato(masa / 1000)
            : "No aplica"
        );

        escribir("formula", formula);
        escribir("detalle", detalle);

        mostrarMensaje(
            "Calculo realizado correctamente."
        );

    } catch (error) {

        mostrarMensaje(error.message);
    }
}


// LIMPIAR FORMULARIO

function limpiarCalculadora() {

    escribir("concentracion", "");
    escribir("volumen", "");

    borrarResultados();

    mostrarMensaje(
        "Ingrese los datos para realizar un nuevo calculo."
    );
}


// EVENTOS DE LA APLICACION

document.addEventListener("DOMContentLoaded", () => {

    $("insumo").addEventListener(
        "change", cargarInsumo
    );

    $("tipoCalculo").addEventListener(
        "change", actualizarConcentracion
    );

    [
        "pureza",
        "densidad",
        "masaMolar",
        "factorEquivalencia"
    ].forEach(id => {

        $(id).addEventListener(
            "input", actualizarConcentracion
        );
    });

    $("calcular").addEventListener(
        "click", evento => {
            evento.preventDefault();
            calcularIQBF();
        }
    );

    $("limpiar").addEventListener(
        "click", evento => {
            evento.preventDefault();
            limpiarCalculadora();
        }
    );

    cargarInsumo();
});
