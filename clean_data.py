import pandas as pd
import numpy as np

# Load raw data
df = pd.read_csv("Loksabha_1962-2019 .csv")

# Clean numeric fields (handles '-', '', NaN, etc.)
def clean_numeric(val):
    try:
        val = str(val).replace(",", "").replace("%", "").strip()
        if val in ["", "-", "NA", "N/A", "nan"]:
            return np.nan
        return float(val)
    except:
        return np.nan

# Clean key numeric columns
for col in ['electors', 'votes', 'margin', 'Turnout', 'margin%']:
    if col in df.columns:
        df[col] = df[col].apply(clean_numeric)

# Normalize party names
party_aliases = {
    'BJP': ['BJP', 'Bharatiya Janata Party', 'Bhartiya Janta Party'],
    'INC': ['INC', 'Indian National Congress', 'Congress', 'I.N.C'],
    'CPI': ['CPI', 'Communist Party of India'],
    'CPI(M)': ['CPI(M)', 'Communist Party of India (Marxist)'],
    'SP': ['SP', 'Samajwadi Party'],
    'BSP': ['BSP', 'Bahujan Samaj Party'],
    'AITC': ['AITC', 'All India Trinamool Congress'],
    'NCP': ['NCP', 'Nationalist Congress Party'],
    'DMK': ['DMK', 'Dravida Munnetra Kazhagam'],
    'AIADMK': ['AIADMK', 'All India Anna Dravida Munnetra Kazhagam']
}

reverse_map = {alias.lower(): std for std, aliases in party_aliases.items() for alias in aliases}

def standardize_party(p):
    return reverse_map.get(str(p).strip().lower(), p)

df['party_standardized'] = df['party'].apply(standardize_party)

# Save cleaned output
df.to_csv("../src/data/cleaned_loksabha_1962_2019.csv", index=False)
print("✅ Cleaned CSV saved to: src/data/cleaned_loksabha_1962_2019.csv")
