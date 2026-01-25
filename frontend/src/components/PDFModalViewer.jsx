import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, PDFViewer, Image as PdfImage } from '@react-pdf/renderer';
import api from '../api/axios';

// --- PDF STYLES ---
const createStyles = (primaryColor = '#000000') => StyleSheet.create({
    page: { flexDirection: 'column', backgroundColor: '#FFFFFF', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, borderBottomWidth: 2, borderBottomColor: primaryColor, paddingBottom: 10 },
    headerText: { flexDirection: 'column' },
    title: { fontSize: 24, fontWeight: 'bold', color: primaryColor },
    subtitle: { fontSize: 12, color: '#666' },
    logo: { width: 80, height: 80, objectFit: 'contain' },
    section: { margin: 10, padding: 10, flexGrow: 1 },
    row: { flexDirection: 'row', marginBottom: 5 },
    label: { width: 100, fontSize: 10, fontWeight: 'bold', color: '#444' },
    value: { flex: 1, fontSize: 10 },
    tableHeader: { backgroundColor: primaryColor, color: 'white', padding: 5, fontSize: 10, flexDirection: 'row' },
    tableRow: { borderBottomWidth: 1, borderBottomColor: '#EEE', padding: 5, fontSize: 10, flexDirection: 'row' }
});

// --- PDF COMPONENT ---
const MyDocument = ({ folio, branchConfig }) => {
    const styles = createStyles(branchConfig?.primaryColor || '#000000');
    // Ensure data exists
    if (!folio) return <Document><Page><Text>No Data</Text></Page></Document>;

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <View style={styles.header}>
                    <View style={styles.headerText}>
                        <Text style={styles.title}>{branchConfig?.name || 'Pastelería'}</Text>
                        <Text style={styles.subtitle}>Folio: #{folio.folioNumber}</Text>
                        <Text style={styles.subtitle}>Fecha: {new Date(folio.deliveryDate).toLocaleDateString()}</Text>
                        <Text style={styles.subtitle}>Cliente: {folio.clientName}</Text>
                    </View>
                    {branchConfig?.logoUrl ? (
                        // Note: React-PDF Image requires valid URL or base64. 
                        // CORS might block external URLs if not configured.
                        <PdfImage src={branchConfig.logoUrl} style={styles.logo} />
                    ) : null}
                </View>

                {/* Content */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Descripción:</Text>
                        <Text style={styles.value}>{folio.designDescription || 'Sin descripción'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Sabor:</Text>
                        {/* Task: Map IDs to names. Assuming backend populated these or we show ID for now? 
                            Ideally backend include: Flavor model. If not, text is ID. 
                            Frontend refactor was FolioForm. 
                            If we want Names, we need `include` in backend or lookup here. 
                            For now, display raw or check if object available. 
                        */}
                        <Text style={styles.value}>
                            {/* Attempt to show name if object, else ID */}
                            {typeof folio.cakeFlavor === 'object' ? folio.cakeFlavor?.name : folio.flavorId || folio.cakeFlavor}
                        </Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Relleno:</Text>
                        <Text style={styles.value}>
                            {typeof folio.filling === 'object' ? folio.filling?.name : folio.fillingId || folio.filling}
                        </Text>
                    </View>
                </View>

                {/* Footer */}
                <View style={{ position: 'absolute', bottom: 30, left: 0, right: 0, textAlign: 'center' }}>
                    <Text style={{ fontSize: 8, color: '#999' }}>Generado digitalmente por {branchConfig?.name || 'Sistema'}</Text>
                </View>
            </Page>
        </Document>
    );
};

// --- VIEWER MODAL ---
const PDFModalViewer = ({ isOpen, onClose, folio, onPrev, onNext, hasPrev, hasNext }) => {
    const [branchConfig, setBranchConfig] = useState(null);

    useEffect(() => {
        if (isOpen && folio?.branchId) {
            // Fetch configuration for the specific branch of the folio
            api.get(`/branches/${folio.branchId}`)
                .then(res => setBranchConfig(res.data))
                .catch(err => console.error("Error fetching branch config for PDF", err));
        }
    }, [isOpen, folio]);

    if (!isOpen || !folio) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full h-full md:w-[90vw] md:h-[90vh] md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">

                {/* Header */}
                <div className="bg-gray-900 text-white p-4 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-bold">Vista Previa - {folio.folioNumber}</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                {/* Viewer */}
                <div className="flex-1 bg-gray-500">
                    <PDFViewer width="100%" height="100%" className="border-none">
                        <MyDocument folio={folio} branchConfig={branchConfig} />
                    </PDFViewer>
                </div>
            </div>
        </div>
    );
};

export default PDFModalViewer;
