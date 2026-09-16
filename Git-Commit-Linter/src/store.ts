import { create } from 'zustand'

import type { TypeFile } from '@/types'

export type AlertType = 'error' | 'successful' | undefined

export interface TypeAlertStore {
  type: AlertType
  message: string | undefined
  setMessage: ({ message, type }: { message: string; type: AlertType }) => void
}

export const useAlertStore = create<TypeAlertStore>()((set) => ({
  message: undefined,
  type: undefined,
  setMessage: ({ message, type }) => set(() => ({ message, type }))
}))

interface TypeAPIKeyStore {
  key: string | null
  setKey: (key: string | null) => void
}

export const useAPIKeyStore = create<TypeAPIKeyStore>()((set) => ({
  key: null,
  setKey: (key) => set(() => ({ key }))
}))

interface TypeDiffStore {
  loading: boolean
  files: TypeFile[]
  index: number
  diff: string
  setLoading: (state: boolean) => void
  setFiles: (files: TypeFile[]) => void
  setIndex: (index: number) => void
  setDiff: (diff: string) => void
}

export const useDiffStore = create<TypeDiffStore>()((set) => ({
  loading: false,
  files: [],
  index: 0,
  diff: '',
  setLoading: (state) => set(() => ({ loading: state })),
  setFiles: (files) => set(() => ({ files })),
  setIndex: (index) => set(() => ({ index })),
  setDiff: (diff) => set(() => ({ diff }))
}))

type TypeCommits = {
  file: string
  commit: string
}[]

interface TypeCommitStore {
  commits: TypeCommits
  setCommit: (cmt: TypeCommits | ((prev: TypeCommits) => TypeCommits)) => void
}

export const useCommitStore = create<TypeCommitStore>()((set) => ({
  commits: [],
  setCommit: (cmt) =>
    set((state) => ({
      commits: typeof cmt === 'function' ? cmt(state.commits) : cmt
    }))
}))
