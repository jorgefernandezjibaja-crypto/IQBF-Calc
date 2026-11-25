
/* ============================================================
   IQBF-Calc
   Calculadora de requerimiento de IQBF
   OG-IQBF - UNIFSLB
   Versión 1.1 - 2026
   ============================================================ */

const $ = id => document.getElementById(id);

const GOTAS_POR_ML = 20;

// ============================================================
// 1. BASE DE DATOS DE INSUMOS QUÍMICOS
// ============================================================

const insumos = {

    acetona: {
        nombre: "Acetona",
        formula: "C₃H₆O",
        estado: "Líquido",
        pureza: 99.98,
        densidad: 0.79,
        masaMolar: 58.08,
        factor: null,
        nota: "La normalidad requiere una reacción específica."
    },

    hcl: {
        nombre: "Ácido clorhídrico",
        formula: "HCl",
        estado: "Líquido",
        pureza: 37,
        densidad: 1.19,
        masaMolar: 36.46,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    hno3: {
        nombre: "Ácido nítrico",
        formula: "HNO₃",
        estado: "Líquido",
        pureza: 65.29,
        densidad: 1.41,
        masaMolar: 63.01,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    h2so4: {
        nombre: "Ácido sulfúrico",
        formula: "H₂SO₄",
        estado: "Líquido",
        pureza: 96.4,
        densidad: 1.84,
        masaMolar: 98.08,
        factor: 2,
        nota: "Normalidad referida a neutralización completa de los dos protones."
    },

    amoniaco: {
        nombre: "Amoniaco",
        formula: "NH₃",
        estado: "Líquido",
        pureza: 29.5,
        densidad: 0.89,
        masaMolar: 17.031,
        factor: 1,
        nota: "Se asume que la concentración comercial está expresada como porcentaje en masa de NH₃. Verificar la etiqueta."
    },

    na2co3: {
        nombre: "Carbonato de sodio",
        formula: "Na₂CO₃",
        estado: "Sólido",
        pureza: 99.7,
        densidad: null,
        masaMolar: 105.99,
        factor: 2,
        nota: "Normalidad referida a neutralización completa del carbonato."
    },

    nh4cl: {
        nombre: "Cloruro de amonio",
        formula: "NH₄Cl",
        estado: "Sólido",
        pureza: 99.8,
        densidad: null,
        masaMolar: 53.49,
        factor: 1,
        nota: "Peso equivalente referido a una reacción ácido-base de un equivalente por mol de NH₄⁺."
    },

    eter: {
        nombre: "Éter etílico",
        formula: "C₄H₁₀O",
        estado: "Líquido",
        pureza: 99.9,
        densidad: 0.715,
        masaMolar: 74.12,
        factor: null,
        nota: "La normalidad requiere una reacción específica."
    },

    kmno4: {
        nombre: "Permanganato de potasio",
        formula: "KMnO₄",
        estado: "Sólido",
        pureza: 99,
        densidad: null,
        masaMolar: 158.03,
        factor: 5,
        nota: "Normalidad referida exclusivamente a la reducción del permanganato a Mn²⁺ en medio ácido."
    },

    naoh: {
        nombre: "Hidróxido de sodio",
        formula: "NaOH",
        estado: "Sólido",
        pureza: 98.5,
        densidad: null,
        masaMolar: 40,
        factor: 1,
        nota: "Normalidad referida a neutralización ácido-base."
    },

    benceno: {
        nombre: "Benceno",
        formula: "C₆H₆",
        estado: "Líquido",
        pureza: 99,
        densidad: 0.88,
        masaMolar: 78.11,
        factor: null,
        nota: "La normalidad requiere una reacción específica."
    },

    cacl2: {
        nombre: "Cloruro de calcio anhidro",
        formula: "CaCl₂",
        estado: "Sólido",
        pureza: 99,
        densidad: null,
        masaMolar: 110.98,
        factor: 2,
        nota: "Pureza asumida de 99 %. Peso equivalente referido a reacciones con dos equivalentes por mol."
    }

};


// ============================================================
// 2. FUNCIONES GENERALES
// ============================================================

function formato(numero, decimales = 6) {

    if (!Number.isFinite(numero)) {
        return "No aplica";
    }

    return Number(numero.toFixed(decimales)).toString();
}


function obtenerInsumo() {

    return insumos[$("insumo").value] || null;

}


function esLiquido(insumo) {

    return insumo.estado === "Líquido";

}


function pesoEquivalente(insumo) {

    if (!insumo.factor) {
        return null;
    }

    return insumo.masaMolar / insumo.factor;

}


function molaridadProducto(insumo) {

    if (!esLiquido(insumo)) {
        return null;
    }

    return (
        insumo.pureza *
        insumo.densidad *
        10
    ) / insumo.masaMolar;

}


function normalidadProducto(insumo) {

    if (!esLiquido(insumo) || !insumo.factor) {
        return null;
    }

    return (
        insumo.pureza *
        insumo.densidad *
        10
    ) / pesoEquivalente(insumo);

}


// ============================================================
// 3. CONVERSIÓN DEL VOLUMEN FINAL A MILILITROS
// ============================================================

function convertirAMililitros(cantidad, unidad) {

    switch (unidad) {

        case "ml":
            return cantidad;

        case "l":
            return cantidad * 1000;

        case "gotas":
            return cantidad / GOTAS_POR_ML;

        default:
            return NaN;

    }

}


// ============================================================
// 4. MENSAJES Y RESULTADOS
// ============================================================

function mostrarMensaje(texto, error = false) {

    const elemento = $("mensaje");

    elemento.textContent = texto;

    elemento.style.padding = texto ? "12px" : "0";
    elemento.style.borderRadius = "5px";

    elemento.style.backgroundColor = error
        ? "#fff3cd"
        : "#e8f4ed";

    elemento.style.color = error
        ? "#856404"
        : "#155724";

}


function limpiarResultados() {

    const campos = [
        "resultadoML",
        "resultadoL",
        "resultadoGotas",
        "resultadoG",
        "resultadoKG",
        "formula",
        "detalle"
    ];

    campos.forEach(id => {
        $(id).textContent = "—";
    });

    mostrarMensaje("");

}


function mostrarResultados(volumenML, masaG) {

    if (volumenML !== null) {

        $("resultadoML").textContent =
            formato(volumenML);

        $("resultadoL").textContent =
            formato(volumenML / 1000, 9);

        $("resultadoGotas").textContent =
            "≈ " + formato(volumenML * GOTAS_POR_ML, 2);

    } else {

        $("resultadoML").textContent = "No aplica";

        $("resultadoL").textContent = "No aplica";

        $("resultadoGotas").textContent = "No aplica";

    }

    $("resultadoG").textContent =
        formato(masaG);

    $("resultadoKG").textContent =
        formato(masaG / 1000, 9);

}


// ============================================================
// 5. CARACTERÍSTICAS DEL INSUMO SELECCIONADO
// ============================================================

function actualizarPropiedades() {

    const insumo = obtenerInsumo();

    limpiarResultados();

    if (!insumo) {

        [
            "estado",
            "pureza",
            "densidad",
            "masaMolar",
            "pesoEquivalente",
            "normalidadExistente",
            "molaridadExistente"
        ].forEach(id => {

            $(id).textContent = "—";

        });

        $("consideraciones").textContent =
            "Seleccione un insumo químico.";

        return;

    }

    $("estado").textContent =
        insumo.estado;

    $("pureza").textContent =
        formato(insumo.pureza) + " %";

    $("densidad").textContent =
        insumo.densidad !== null
        ? formato(insumo.densidad) + " g/mL"
        : "No requerida";

    $("masaMolar").textContent =
        formato(insumo.masaMolar) + " g/mol";


    const PE = pesoEquivalente(insumo);

    $("pesoEquivalente").textContent =
        PE !== null
        ? formato(PE, 4) + " g/eq"
        : "Depende de la reacción";


    const N = normalidadProducto(insumo);

    $("normalidadExistente").textContent =
        N !== null
        ? formato(N, 3) + " eq/L"
        : esLiquido(insumo)
            ? "No definida"
            : "No aplica al sólido";


    const M = molaridadProducto(insumo);

    $("molaridadExistente").textContent =
        M !== null
        ? formato(M, 3) + " mol/L"
        : "No aplica al sólido";


    const opcionNormalidad =
        $("tipoCalculo").querySelector(
            'option[value="normalidad"]'
        );

    opcionNormalidad.disabled =
        insumo.factor === null;

    if (
        insumo.factor === null &&
        $("tipoCalculo").value === "normalidad"
    ) {

        $("tipoCalculo").value = "molaridad";

    }


    actualizarTipoCalculo();

}


// ============================================================
// 6. ACTUALIZAR TIPO DE CONCENTRACIÓN
// ============================================================

function actualizarTipoCalculo() {

    const insumo = obtenerInsumo();

    const tipo = $("tipoCalculo").value;

    limpiarResultados();


    const opcionPorcentaje =
        $("tipoCalculo").querySelector(
            'option[value="porcentaje"]'
        );


    if (insumo && esLiquido(insumo)) {

        opcionPorcentaje.textContent =
            "Porcentaje (% v/v)";

    } else if (insumo) {

        opcionPorcentaje.textContent =
            "Porcentaje (% m/v)";

    } else {

        opcionPorcentaje.textContent =
            "Porcentaje (%)";

    }


    switch (tipo) {

        case "normalidad":

            $("labelConcentracion").textContent =
                "Concentración requerida (eq/L)";

            break;


        case "molaridad":

            $("labelConcentracion").textContent =
                "Concentración requerida (mol/L)";

            break;


        case "porcentaje":

            $("labelConcentracion").textContent =
                insumo && esLiquido(insumo)
                ? "Concentración requerida (% v/v)"
                : "Concentración requerida (% m/v)";

            break;

    }


    if (insumo) {

        let nota = insumo.nota;

        if (esLiquido(insumo)) {

            nota +=
                " Las conversiones a gotas son aproximadas: 20 gotas/mL.";

            if (tipo === "porcentaje") {

                nota +=
                    " El porcentaje v/v se refiere al volumen del producto comercial respecto al volumen final, no al volumen de sustancia pura.";

            }

        } else {

            nota +=
                " La cantidad del reactivo sólido se expresa en gramos y kilogramos.";

        }

        $("consideraciones").textContent = nota;

    }

}


// ============================================================
// 7. MOTOR PRINCIPAL DE CÁLCULO
// ============================================================

function calcularRequerimiento() {

    limpiarResultados();

    const insumo = obtenerInsumo();

    if (!insumo) {

        mostrarMensaje(
            "Seleccione un insumo químico.",
            true
        );

        return;

    }


    const tipo = $("tipoCalculo").value;

    const concentracion =
        parseFloat($("concentracion").value);

    const cantidad =
        parseFloat($("cantidad").value);

    const unidad = $("unidad").value;

    const pureza = insumo.pureza / 100;


    // Validación de datos

    if (
        !Number.isFinite(concentracion) ||
        concentracion <= 0
    ) {

        mostrarMensaje(
            "Ingrese una concentración mayor que cero.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(cantidad) ||
        cantidad <= 0
    ) {

        mostrarMensaje(
            "Ingrese una cantidad final mayor que cero.",
            true
        );

        return;

    }


    if (
        !Number.isFinite(pureza) ||
        pureza <= 0 ||
        pureza > 1
    ) {

        mostrarMensaje(
            "La pureza del insumo no es válida.",
            true
        );

        return;

    }


    const volumenFinalML =
        convertirAMililitros(cantidad, unidad);

    const volumenFinalL =
        volumenFinalML / 1000;

    if (
        !Number.isFinite(volumenFinalML) ||
        volumenFinalML <= 0
    ) {

        mostrarMensaje(
            "El volumen final no es válido.",
            true
        );

        return;

    }


    let volumenML = null;

    let masaG = 0;

    let formula = "";

    let detalle = "";


// ============================================================
// 8. CÁLCULOS PARA INSUMOS LÍQUIDOS
// ============================================================

    if (esLiquido(insumo)) {


        // NORMALIDAD

        if (tipo === "normalidad") {

            const N1 =
                normalidadProducto(insumo);

            if (N1 === null) {

                mostrarMensaje(
                    "La normalidad no está definida para este insumo.",
                    true
                );

                return;

            }

            if (concentracion > N1) {

                mostrarMensaje(
                    "La concentración requerida supera la normalidad del producto existente.",
                    true
                );

                return;

            }


            volumenML =
                (concentracion * volumenFinalML) / N1;

            masaG =
                volumenML * insumo.densidad;


            formula =
                "N₁ × V₁ = N₂ × V₂; V₁ = (N₂ × V₂) / N₁";

            detalle =
                "N₁ = " + formato(N1, 6) +
                " eq/L. V₁ = (" +
                formato(concentracion) +
                " × " +
                formato(volumenFinalML) +
                ") / " +
                formato(N1, 6) +
                " = " +
                formato(volumenML) +
                " mL de producto comercial.";

        }


        // MOLARIDAD

        else if (tipo === "molaridad") {

            const M1 =
                molaridadProducto(insumo);

            if (concentracion > M1) {

                mostrarMensaje(
                    "La concentración requerida supera la molaridad del producto existente.",
                    true
                );

                return;

            }


            volumenML =
                (concentracion * volumenFinalML) / M1;

            masaG =
                volumenML * insumo.densidad;


            formula =
                "M₁ × V₁ = M₂ × V₂; V₁ = (M₂ × V₂) / M₁";

            detalle =
                "M₁ = " + formato(M1, 6) +
                " mol/L. V₁ = (" +
                formato(concentracion) +
                " × " +
                formato(volumenFinalML) +
                ") / " +
                formato(M1, 6) +
                " = " +
                formato(volumenML) +
                " mL de producto comercial.";

        }


        // PORCENTAJE VOLUMEN / VOLUMEN

        else if (tipo === "porcentaje") {

            if (concentracion > 100) {

                mostrarMensaje(
                    "El porcentaje v/v no puede superar el 100 %.",
                    true
                );

                return;

            }


            volumenML =
                (concentracion / 100) *
                volumenFinalML;

            masaG =
                volumenML * insumo.densidad;


            formula =
                "V₁ = (% v/v × V₂) / 100";

            detalle =
                "V₁ = (" +
                formato(concentracion) +
                " × " +
                formato(volumenFinalML) +
                ") / 100 = " +
                formato(volumenML) +
                " mL de producto comercial.";

        }

    }


// ============================================================
// 9. CÁLCULOS PARA INSUMOS SÓLIDOS
// ============================================================

    else {


        // NORMALIDAD

        if (tipo === "normalidad") {

            const PE =
                pesoEquivalente(insumo);

            if (PE === null) {

                mostrarMensaje(
                    "El peso equivalente no está definido.",
                    true
                );

                return;

            }


            masaG =
                (
                    concentracion *
                    PE *
                    volumenFinalL
                ) / pureza;


            formula =
                "m = (N × PE × V) / (P / 100)";

            detalle =
                "m = (" +
                formato(concentracion) +
                " × " +
                formato(PE) +
                " × " +
                formato(volumenFinalL) +
                ") / " +
                formato(pureza) +
                " = " +
                formato(masaG) +
                " g de producto comercial.";

        }


        // MOLARIDAD

        else if (tipo === "molaridad") {

            masaG =
                (
                    concentracion *
                    insumo.masaMolar *
                    volumenFinalL
                ) / pureza;


            formula =
                "m = (M × MM × V) / (P / 100)";

            detalle =
                "m = (" +
                formato(concentracion) +
                " × " +
                formato(insumo.masaMolar) +
                " × " +
                formato(volumenFinalL) +
                ") / " +
                formato(pureza) +
                " = " +
                formato(masaG) +
                " g de producto comercial.";

        }


        // PORCENTAJE MASA / VOLUMEN

        else if (tipo === "porcentaje") {

            masaG =
                (
                    concentracion *
                    volumenFinalML
                ) / (100 * pureza);


            formula =
                "m = (% m/v × V) / (100 × P/100)";

            detalle =
                "m = (" +
                formato(concentracion) +
                " × " +
                formato(volumenFinalML) +
                ") / (100 × " +
                formato(pureza) +
                ") = " +
                formato(masaG) +
                " g de producto comercial.";

        }

    }


// ============================================================
// 10. PRESENTACIÓN DE RESULTADOS
// ============================================================

    if (
        !Number.isFinite(masaG) ||
        masaG <= 0
    ) {

        mostrarMensaje(
            "No fue posible obtener un resultado válido.",
            true
        );

        return;

    }


    mostrarResultados(volumenML, masaG);

    $("formula").textContent = formula;

    $("detalle").textContent =
        detalle +
        " Volumen final requerido: " +
        formato(volumenFinalML) +
        " mL.";


    mostrarMensaje(
        "Cálculo teórico realizado correctamente."
    );

}


// ============================================================
// 11. LIMPIAR DATOS
// ============================================================

function limpiarDatos() {

    $("concentracion").value = "";

    $("cantidad").value = "";

    $("unidad").value = "ml";

    actualizarTipoCalculo();

    limpiarResultados();

}


// ============================================================
// 12. EVENTOS DE LA INTERFAZ
// ============================================================

$("insumo").addEventListener(
    "change",
    actualizarPropiedades
);

$("tipoCalculo").addEventListener(
    "change",
    actualizarTipoCalculo
);

$("btnCalcular").addEventListener(
    "click",
    calcularRequerimiento
);

$("btnLimpiar").addEventListener(
    "click",
    limpiarDatos
);

[
    "concentracion",
    "cantidad",
    "unidad"
].forEach(id => {

    $(id).addEventListener(
        "input",
        limpiarResultados
    );

});


// ============================================================
// 13. INICIALIZACIÓN
// ============================================================

actualizarPropiedades();
